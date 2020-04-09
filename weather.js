'use strict';
let weatherObj ={}
const serverObj = require('./helper.js');

weatherObj.weatherHandler = function(request, response) {
  const city = request.query.search_query; 
  getWeather(city)
  .then (weatherData => response.status(200).json(weatherData));
}

function getWeather(city) {
  let key = process.env.WEATHER_API_KEY;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`;
  return serverObj.superagent.get(url)
  .then(weatherData => {
    let weatherSummaries = weatherData.body.data.map(obj => {
    var weatherData = new Weather(obj);
    return weatherData
    })
    return weatherSummaries;

  })
}
function Weather(day) {
  this.forecast = day.weather.description;
    // this.time = new Date(day.valid_date).toString().slice(0,15);
    this.time = day.valid_date;
}

module.exports= weatherObj;
