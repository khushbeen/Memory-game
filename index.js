
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

//config
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'memory_game',
    password: ''
});

conn.connect(function(err){
    if(err) {
        console.log(err);
        return err;
    }
    else {
        console.log('Database ----- ok');
    }
});

let query = 'SELECT * from results';

conn.query(query, function(err, result){
    console.log(err);
    console.log(result[0]['user_name']);
});

conn.end(function(err){
    if(err) {
        console.log(err);
        return err;
    }
    else {
        console.log('Database ----- Close');
    }
});

const http = require('http');
const url = require('url');

http.createServer(function(req, res) {
    let urlParts = url.parse(req.url);

    if(req.method == 'GET') {
        switch(urlParts.pathname) {
            case '/': 
                sendRes('index.html', 'text/html', res);
                break;
            default:
                sendRes(req.url, getContentType(req.url), res);
                break;
        }
    }
}).listen(3000);

console.log('Server running at http://localhost:3000/');

function sendRes(url, contentType, res) {
    let file = path.join(__dirname + '/memory/', url);
    fs.readFile(file, function(err, content){
        if(err) {
            res.writeHead(404);
            res.write('File not found');
            res.end();
        }
        else {
            res.writeHead(200, {'Content-type': contentType});
            res.write(content);
            res.end();          
        }
    });
}

function getContentType(url) {
    switch(path.extname(url)) {
        case '.html':
            return "text/html";
        case '.css':
                return "text/css";
        case '.js':
            return "text/javascript";
        default:
            return 'application/octate-stream';
    }
}