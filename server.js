'use strict';

const express = require('express');

const cors = require('cors');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const server =  express();

server.use(cors());

server.listen(PORT,()=>{
    console.log(`lissadsad to my port ${PORT}`)
})

server.get('/',(request,response) => {
    response.status(200).send('IT WORK')
})



// localhost:3000/location?city=Lynnwood
server.get('/location',(req,res)=>{
 const city = req.query.city;
 const geoData = require('./data/geo.json');
//  console.log(geoData);
//  let formatted_query = geoData[0].display_name;
//  console.log(formatted_query);
//  let latitude = geoData[0].lat;
//  let longitude = geoData[0].lon;
//  console.log(latitude);
//  console.log(longitude);
 const locationData = new Location(city,geoData);
 res.send(locationData);
});
 function Location(city,geoData ){
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.latitude=geoData[0].lat;
    this.longitude = geoData[0].lon;
 }
 let lastTry=[];
 server.get('/weather',(req,res)=>{
    // const city = req.query.city;
    const weathData = require('./data/weather.json');
    for (let index = 0; index < weathData.data.length; index++) {
        const weatherData = new Weather(index,weathData);
        lastTry.push(weatherData);  
            }
            res.send(lastTry);  

   });
   function Weather(index,weathData ){
    // this.search_query = city;
    this.description = weathData.data[index].weather.description;
    this.time = weathData.data[index].valid_date;
   }

server.use('*',(req,res)=>{
    res.status(404).send('Go kill your self :*(');
});

server.use((error,req,res)=>{
    res.status(500).send('Sorry, something went wrong');
});