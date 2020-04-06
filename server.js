'use strict';

// Load environment variables from .env
require('dotenv').config();

// Application dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

// Application setup
const PORT = process.env.PORT;
const server =  express();
server.use(cors());

// server.listen(PORT,()=>{
//     console.log(`lissadsad to my port ${PORT}`)
// });

server.get('/',(request,response) => {
    response.send('IT WORK');
});

//Route definitions
server.get('/location',locationHandler);
server.get('/weather',weatherHandler);

//Route handlers
// localhost:3030/location?city=Lynnwood
function locationHandler(request, response) {
 const city = request.query.city;
 getLocation(city)
.then(locationData=> response.status(200).json(locationData));

};
function   getLocation(city){
let key = process.env.LOCATION_KEY;
const url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
return superagent.get(url)
.then(geoData => {
    const locationData = new Location(city,geoData.body);
    return locationData;
})
}
 function Location(city,geoData ){
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.latitude=geoData[0].lat;
    this.longitude = geoData[0].lon;
 }

 function weatherHandler(request, response) {
  const city = request.query.search_query; 
  getWeather(city)
  .then (weatherData => response.status(200).json(weatherData));
}

let weatherSummaries = [];

function getWeather(city) {

  let key = process.env.WEATHER_API_KEY;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`;
  console.log(url);
  return superagent.get(url)
  .then(weatherData => {
    weatherData.body.data.forEach(val => {
      var weatherData = new Weather(val);
      weatherSummaries.push(weatherData);
    });
    return weatherSummaries;

  })

}
function Weather(day) {
  this.forecast = day.weather.description;
    // this.time = new Date(day.valid_date).toString().slice(0,15);
    this.time = day.valid_date;
}



//Make sure the server is listening for requests
server.listen(PORT, () => console.log(`App is listening on ${PORT}`));


//  server.use('*',(req,res)=>{
//   res.status(404).send('Go kill your self :*(');
// });

// server.use((error,req,res)=>{
//   res.status(500).send('Sorry, something went wrong');
// });

 //function weatherHandler(req,res){
  //     const city = req.query.search_query;
  //     getWeather(city)
  //     .then (weatherData => res.status(200).json(weatherData));
  //  }
//  let lastTry=[];

//  function getWeather(city) {
//     let key = process.env.WEATHER_API_KEY; 
//     const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`;
//     return superagent.get(url)
//     .then(weatherData => {
//     for (let index = 0; index < weathData.data.length; index++) {
//         const weatherData = new Weather(index,weathData);
//         lastTry.push(weatherData);  
//             }
//             return weatherSummaries;
            

//    }};
//    function Weather(index,weathData ){
//     // this.search_query = city;
//     this.description = weathData.data[index].weather.description;
//     this.time = weathData.data[index].valid_date;
//    }

