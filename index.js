const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const darkSkyKey = require('./darkskyapi.json');
const fs = require('fs');
const path = require('path');
const request = require('request');
const rp = require('request-promise');
const dataJson = require('./data.json');
const probDataJson = require('./heatmapdata.json');
const port = 8097;


app.use('/', express.static('frontend'));
app.use('/heatmapdata.json', express.static('heatmapdata.json'));
app.use(bodyParser.json());


app.get('/', (req, res) => res.sendFile(path.resolve('./frontend/index.html')));

app.post('/adddata', (req, res) => {
	const data = req.body;
	dataJson.push(data);
	generateProb(data);
	console.log(data);
	res.sendStatus(200);
});

async function getWeather() {
	rp(`https://api.darksky.net/forecast/${darkSkyKey.key}/42.484390,-71.191670,255657600?exclude=currently,flags,hourly,minutely`, function (error, response, body) {
  		const dailyData = JSON.parse(body).daily.data[0];
	});
}

async function generateProb(data) {
	let prob = 0;
	if (data.temp >= 26) {
		prob += 1;
	}
	if (data.hum >= 75) {
		prob += 1;
	}

	const dateNow = Math.floor(Date.now() / 1000);
	const dateYesterday = dateNow - 84600;
	
	/* const todayWeatherData = rp(`https://api.darksky.net/forecast/${darkSkyKey.key}/${data.lat},${data.long},${dateNow}?exclude=currently,flags,hourly,minutely`);
	const todayParsedData = JSON.parse(await todayWeatherData);
	const todayWindSpeed = todayParsedData.daily.data[0].windSpeed;
	const todayPrecip = todayParsedData.daily.data[0].precipIntensity;

	const yesterdayWeatherData = rp(`https://api.darksky.net/forecast/${darkSkyKey.key}/${data.lat},${data.long},${dateYesterday}?exclude=currently,flags,hourly,minutely`);
	const yesterdayParsedData = JSON.parse(await yesterdayWeatherData);
	const yesterdayPrecip = yesterdayParsedData.daily.data[0].precipIntensity;

	const avgPrecip = (todayPrecip + yesterdayPrecip) / 2;

	if (todayWindSpeed < 7) {
		prob += 1;
	}
	if (avgPrecip > 0.4) {
		prob +=1;
	} */

	console.log(prob / 4);

	probDataJson.push([data.lat, data.long, prob / 4]);
}

setInterval(() => {
	fs.writeFile('./data.json', JSON.stringify(dataJson), err => {
		if (err)
			console.error(err);	
	});
	fs.writeFile('./heatmapdata.json', JSON.stringify(probDataJson), err => {
		if (err)
			console.error(err);	
	});
}, 10000);

app.listen(port, () => console.log('Listening...'));
