var http = require('http');
var fs = require('fs');
var path = require('path');
var https = require('https');
var JSFtp = require('jsftp');
var config = require('./config.json');

var server = http.createServer(function(req, res) {
    if(req.url === '/favicon.ico') return res.statusCode = 404, res.end();
    if (req.url === '/test') return res.end();
    console.log(req.method + ' ' + req.url);
    var data = '';
    req.on('data', function(chunk) {
        data += chunk;
    });
    req.on('end', function() {
        console.log(data);
        data = JSON.parse(data);
        https.get(data.url, function (res) {
            var chunks = [];
            res.on('data', function (chunk) {
                chunks.push(chunk);
            });
            res.on('end', function () {
                console.log('downloaded audio');
                saveOnFtp(Buffer.concat(chunks), data);
            });
            res.on('error', function (e) {
                console.log('error https.get', e);
            });
        });

    });
    req.on('error', function (e) {
        console.log('error', e);
    });
    res.end('done');
});

server.listen(config.server.port, function() {
    console.log('listening', config.server.port);
});

function saveOnFtp(file, data) {
    console.log('save on ftp');
    var ftp = new JSFtp(config.ftpCreds);
    ftp.put(file, data.audioName +  '.mp3', function(hadError) {
        if (!hadError)
            console.log("File transferred successfully!");
        ftp.destroy();
    });
}
