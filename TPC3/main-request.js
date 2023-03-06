// main-request.js
// 2023-03-06: by jmm

var http = require('http')
var axios = require('axios')
var mypages = require('./mypages')
var fs = require('fs')

http.createServer(function(req,res){
    var d = new Date().toISOString().substring(0,16)
    console.log(req.method + " " + req.url + " " + d)

    if(req.url == '/'){
        res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
        res.end(mypages.genMainPage(d))
    }

    else if(req.url == '/pessoas'){
        axios.get('http://localhost:3000/pessoas')
         .then(function(resp){
            var pessoas = resp.data
            
            res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
            res.end(mypages.genPeoplePage(pessoas,"",""))
         })
         .catch(erro => {
            console.log("Erro: " + erro)
            res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
            res.end("<p>Erro " + erro + "</p>")
         })
    }

    else if (req.url == '/pessoasOrd'){
        axios.get('http://localhost:3000/pessoas')
        .then(function(resp){
           var pessoas = resp.data
           let pessoasOrdenadas = pessoas.sort(
            (p1,p2) => (p1.nome < p2.nome) ? -1 : 1
           )
           
           res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
           res.end(mypages.genPeoplePage(pessoasOrdenadas,"ordenada",""))
        })
        .catch(erro => {
           console.log("Erro: " + erro)
           res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
           res.end("<p>Erro " + erro + "</p>")
        })
    }

    else if (req.url.match(/p\d+/)){
        axios.get('http://localhost:3000/pessoas/' + req.url.substring(9))
        .then(function(resp){
           var pessoa = resp.data
           
           res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
           res.end(mypages.genPersonPage(pessoa))
        })
        .catch(erro => {
           console.log("Erro: " + erro)
           res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
           res.end("<p>Erro " + erro + "</p>")
        })
    }

    else if(req.url.match(/dist/)){
        axios.get('http://localhost:3000/pessoas')
         .then(function(resp){
            var pessoas = resp.data
            
            res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
            res.end(mypages.genDistPage(pessoas,req.url.substring(13)))
         })
         .catch(erro => {
            console.log("Erro: " + erro)
            res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
            res.end("<p>Erro " + erro + "</p>")
         })
    }

    else if (req.url.match(/w3\.css$/)){
        fs.readFile('w3.css', function(err,data) {
            res.writeHead(200,{'Content-Type': 'text/css'})
            if (err){
                res.write("Erro na leitura do ficheiro: " + err)
            }
            else {
            res.write(data)
            }
            res.end()
        })
    }

    else if(req.url.match('/pessoas\?')){
        var real_url = req.url.substring(9)
        var desporto = ""

        if (real_url.substring(0,1) == 'd') { 
            desporto = decodeURIComponent(req.url.substring(18))
            real_url = "" 
        }

        axios.get('http://localhost:3000/pessoas?' + real_url)
         .then(function(resp){
            var pessoas = resp.data
            
            res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
            res.end(mypages.genPeoplePage(pessoas,"",desporto))
         })
         .catch(erro => {
            console.log("Erro: " + erro)
            res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
            res.end("<p>Erro " + erro + "</p>")
         })
    }

    else{
        res.writeHead(404,{'Content-Type': 'text/html; charset=utf-8'})
        res.end("<p>ERRO: Operação não suportada...</p>")
    }

}).listen(7777)


console.log('À escuta na porta 7777...')