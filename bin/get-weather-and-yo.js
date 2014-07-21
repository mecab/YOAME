var request = require('request');
var E = require('linq');
var moment = require('moment-timezone');

var getWeatherAndYo = function() {

    var options = {
	'url': "http://api.openweathermap.org/data/2.5/forecast?q=shinagawa-ku,%20jp",
	'json': true
    };

    var dt = moment().tz('Asia/Tokyo');
    console.log('hours: ' + dt.hours());

    if (dt.hours() > 20 || dt.hours() < 7) {
	console.log("Zzz... exit.");
	return;
    }
    if (dt.hours() != 7 && dt.hours() % 3 != 0) {
	console.log("dt.hours() != 7 && dt.hours() % 3 != 0");
	return;
    }

    function yo() {
	request.post({
	    'url': "http://api.justyo.co/yoall/",
	    'form': { 'api_token': 'YOUR_YO_API_TOKEN_HERE' }
	}, function(err, res, body) {
	    if (err) {
		console.log(err);
		return;
	    }
	    console.log(body);
	    console.log('yo success');
	});
    }

    request.get(options, function(err, res, body) {
	if (err) {
	    console.log(err);
	    return;
	}

	var weathers = E.from(body.list)
	    .select("$.weather[0].main");

	/* weathers
	   .forEach(function(weather) {
	   console.log(weather);
	   }); */

	var takeNum = dt.hours() == 7 ? 4 : 1;

	var isRain = weathers
	    .take(takeNum)
	    .any("$=='Rain'")
	if (isRain) {
	    console.log("Rain!!!");
	    yo();
	}
	else {
	    console.log("No rain -_-");
	}
    });
}
module.exports = getWeatherAndYo;
