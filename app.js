var finalhandler = require('finalhandler');
var path = require('path');
var http = require('http');
var serveStatic = require('serve-static');

var serve = serveStatic('static', {'index': ['index.html', 'index.htm']});
var server = http.createServer(function(req, res) {
    var done = finalhandler(req, res);
    serve(req, res, done)
});

server.listen(process.env.PORT || 3000);
