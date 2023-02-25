var http = require('http')
var fs = require('fs')
var url = require('url')

http.createServer(function(req,res){
    var request = url.parse(req.url,true).pathname
    var d = new Date().toISOString().substring(0,16)
    console.log(req.method + " " + req.url + " " + d)
    var read = request == '/' ? 'index' : 'cities' + request
    fs.readFile(read + '.html', function(err,data) {
        res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
        if (err){
            res.write("Error reading file: " + err)
        }
        else {
        res.write(data)
        }
        res.end()
    })

}).listen(7777)


console.log('Listening on port 7777...')