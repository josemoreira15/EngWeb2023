// main-server.js
// tpc4EngWeb2023: 2023-03-09
// by jmm

var http = require('http')
var axios = require('axios')
var templates = require('./template')
var static = require('./static.js')
const { parse } = require('querystring');

function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

//server - main function

var mainServer = http.createServer(function (req, res) {
    // logger: what was requested and when it was requested
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // handling request
    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                // GET /users
                if((req.url == "/")){
                    axios.get("http://localhost:3000/data?_sort=date,name")
                        .then(response => {
                            var data = response.data

                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.mainPage(data, d))
                            res.end()
                        })
                        .catch(function(erro){
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.infoPage("ERROR: " + erro, d))
                            res.end()
                        })
                }

                else if(/\/edit\/[0-9]+$/.test(req.url)){
                    axios.get("http://localhost:3000/data/" + req.url.substring(6))
                        .then(response => {
                            var data = response.data
                            data['status'] = 'done'

                            axios.put("http://localhost:3000/data/" + req.url.substring(6), data)
                            .then(() => {
                                res.writeHead(201, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write(templates.infoPage("Task done!", d))
                                res.end()
                            })
                            .catch(error => {
                                console.log('Erro: ' + error);
                                res.writeHead(201, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write(templates.infoPage("Couldn't update the task!", d))
                                res.end()
                            })
                                
                        })
                        .catch(function(erro){
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.infoPage("Couldn't get the user information. Error: " + erro, d))
                            res.end()
                        })
                }

                else if(/\/delete\/[0-9]+$/.test(req.url)){
                    axios.delete("http://localhost:3000/data/" + req.url.substring(8))
                        .then(() => {
                            res.writeHead(201, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.infoPage("Task removed from your done tasks!", d))
                            res.end()
                        })
                        .catch(error => {
                            console.log('Erro: ' + error);
                            res.writeHead(201, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.infoPage("Couldn't remove your task! Try again, please.", d))
                            res.end()
                        })
                }
                
                
                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write("<p>" + req.method + " " + req.url + " unsupported on this server.</p>")
                    res.end()
                }
                break

            case "POST":
                if(req.url == "/"){
                    collectRequestBodyData(req, result => {
                        if(result && result['task'] != '' && result['author'] != '' && result['date'] != ''){
                            result['status'] = 'todo'
                            console.dir(result)
                            axios.post("http://localhost:3000/data/", result)
                                .then(() => {
                                    res.writeHead(201, {'Content-Type': 'text/html;charset=utf-8'})
                                    res.write(templates.infoPage("Task added!", d))
                                    res.end()
                                })
                                .catch(error => {
                                    console.log('Erro: ' + error);
                                    res.writeHead(201, {'Content-Type': 'text/html;charset=utf-8'})
                                    res.write(templates.infoPage("Couldn't update! Try again later, please.", d))
                                    res.end()
                                })
                        }
                        else{
                            res.writeHead(201, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.infoPage("Incorrect fields! Try again, please.", d))
                            res.end()
                        }
                    });
                }
                break
        }
    }
    
})

mainServer.listen(7777, ()=>{
    console.log("Server listening on port 7777...")
})