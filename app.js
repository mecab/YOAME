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

/////
/*
var getWeatherAndYo = require('./get-weather-and-yo');
var cronJob = require('cron').CronJob;
var job = new cronJob({
    'cronTime': "0 2 7-18/1 * * *",
    'onTick': function() {
	getWeatherAndYo();
    },
    'start': false,
    'timeZone': "Asia/Tokyo"
});
job.start();
*/