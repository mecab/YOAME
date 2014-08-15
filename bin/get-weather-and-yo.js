var request = require('request');
var E = require('linq');
var moment = require('moment-timezone');
var config = require('./config');

var getWeatherAndYo = function(areaCode, apiToken) {
    console.log(areaCode, apiToken);

    var options = {
	'url': "http://api.openweathermap.org/data/2.5/forecast?q=" + areaCode,
	'json': true
    };

    var dt = moment().tz('Asia/Tokyo');
    console.log('hours: ' + dt.hours());

    // Sleep in night
    if (dt.hours() > 20 || dt.hours() < 7) {
	console.log("Zzz... exit.");
	return;
    }
    // Skip except 7am, 9am, 12noon, 15pm, 18pm, 20pm
    if (dt.hours() != 7 && dt.hours() % 3 != 0) {
	console.log("dt.hours() != 7 && dt.hours() % 3 != 0");
	return;
    }

    function yo() {
	request.post({
	    'url': "http://api.justyo.co/yoall/",
	    'form': { 'api_token': apiToken }
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

var getWeatherAndYoForAll = function() {
    E.from(config.areaList).forEach(function(area) {
	getWeatherAndYo(area.areaCode, area.apiToken);
    });
}
module.exports = getWeatherAndYoForAll;
