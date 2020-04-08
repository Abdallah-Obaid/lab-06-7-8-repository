'use strict';

// Load environment variables from .env
require('dotenv').config();

// Application dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
// Application setup
const PORT = process.env.PORT;
const server =  express();
server.use(cors());
const client = new pg.Client(process.env.DATABASE_URL);

//global vars
let longitude;
let latitude ;
let cityGlobel;

// server.listen(PORT,()=>{
//     console.log(`lissadsad to my port ${PORT}`)
// });

server.get('/',(request,response) => {
    response.send('IT WORK');
});

//Route definitions
server.get('/location',locationHandler);
server.get('/weather',weatherHandler);
server.get('/trails',trailsHandler);
server.get('/movies',moviesHandler);
server.get('/yelp', yelpsHandler);

//Route handlers
// localhost:3030/location?city=Lynnwood
function locationHandler(request, response) {
 const city = request.query.city;
 let loc;
 client.query("SELECT * FROM locations WHERE search_query = $1;",
  [city],
  (error, result) => {
    loc = result.rows[0];
    if (loc == undefined){
    console.log(loc)
    getLocation(city)
    .then (locationData =>{ 
      client.query("INSERT INTO locations (formatted_query,search_query,latitude,longitude) VALUES ($1,$2,$3,$4);",
      [locationData.formatted_query,locationData.search_query,locationData.latitude,locationData.longitude],
      (error, result) => {
        loc =locationData;});
        longitude = loc.longitude;
        latitude  = loc.latitude;
        cityGlobel = loc.search_query;
        response.status(200).json(loc)
      })
  }else{
          longitude = loc.longitude;
      latitude  = loc.latitude;
      cityGlobel = loc.search_query;
      response.status(200).json(loc)
  }
  });
};

function getLocation(city){
let key = process.env.GEOCODE_API_KEY;
const url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
  
return superagent.get(url)
.then(geoData => {
    const locationData = new Location(city,geoData.body);
    longitude = locationData.longitude;
    latitude =locationData.latitude;
    cityGlobel = locationData.search_query;
    return locationData;
})
}

 function Location(city,Data){
    this.search_query = city;
    this.formatted_query = Data[0].display_name;
    this.latitude= Data[0].lat;
    this.longitude = Data[0].lon;
 }

 function weatherHandler(request, response) {
  const city = request.query.search_query; 
  getWeather(city)
  .then (weatherData => response.status(200).json(weatherData));
}

function getWeather(city) {
  let key = process.env.WEATHER_API_KEY;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`;
  return superagent.get(url)
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

 function trailsHandler(request, response) {
  //If we dont want to get the latitude and longitude from the location api
  const latitude = request.query.latitude; 
  const longitude = request.query.longitude; 

  getTrail(latitude,longitude)
  .then (trailArray => response.status(200).json(trailArray));
}

function getTrail(latitude,longitude) {

   console.log(longitude,latitude,"hi");
   let key = process.env.TRAIL_API_KEY;
   const url = `https://www.hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxDistance=10&key=${key}`;
  return superagent.get(url)
  .then(data => {
     let trailArray = [];
        data.body.trails.forEach(val =>{
        const trailData = new TRAI(val);
        trailArray.push(trailData)
        })
        return trailArray;
  })
}


  function TRAI (dataa ){
     this.name = dataa.name;
     this.location=dataa.location;
     this.length = dataa.length;
     this.stars = dataa.stars;
     this.star_votes=dataa.starVotes;
     this.summary = dataa.summary;
     this.trail_url = dataa.url;
     this.conditions=dataa.conditionDetails;
     this.condition_date = dataa.conditionDate.split(' ')[0];
     this.condition_time = dataa.conditionDate.split(' ')[1];
  }

  function moviesHandler(request, response) {
    //If we dont want to get the latitude and longitude from the location api  
    getMovies()
    .then (MoviesArray => response.status(200).json(MoviesArray));
  }
  
  function getMovies() {
     let key = process.env.MOVIE_API_KEY;
     console.log(cityGlobel);
     const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${cityGlobel}`;
    return superagent.get(url)
    .then(data => {
       let MoviesArray = [];
          data.body.results.forEach(val =>{
          const MoviesData = new Movie(val);
          MoviesArray.push(MoviesData)
          })
          return MoviesArray;
    })
    .catch(err => errorHandler(err))
  }

    function Movie (dataa ){
       this.title = dataa.title;
       this.overview=dataa.overview;
       this.average_votes = dataa.vote_average;
       this.total_votes = dataa.vote_count;
       this.image_url=dataa.poster_path;
       this.popularity = dataa.popularity;
       this.released_on = dataa.release_date;
    }
    function yelpsHandler(request, response) {
      //If we dont want to get the latitude and longitude from the location api  
      getYelps()
      .then (YelpsArray => response.status(200).json(YelpsArray));
    }
    
    function getYelps() {
       let key = process.env.YELP_API_KEY;
       const url = `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}}`;
      return superagent.get(url,headers = header)
      .then(data => {
         let YelpsArray = [];
            data.body.results.forEach(val =>{
            if(YelpsArray.length === 20){
              return YelpsArray;
            }
            const YelpData = new Yelp(val);
            YelpsArray.push(YelpData)
            })
            return YelpsArray;
      })
      .catch(err => errorHandler(err))
    }
  
      function Yelp (dataa ){
        //  this.title = dataa.title;
        //  this.overview=dataa.overview;
        //  this.average_votes = dataa.vote_average;
        //  this.total_votes = dataa.vote_count;
        //  this.image_url=dataa.poster_path;
        //  this.popularity = dataa.popularity;
        //  this.released_on = dataa.release_date;
      }

//Make sure the server is listening for requests
client.connect()
.then(()=>{
server.listen(PORT, () => console.log(`App is listening on ${PORT}`));})


 server.use('*',(req,res)=>{
  res.status(404).send('Go kill your self :*(');
});

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

