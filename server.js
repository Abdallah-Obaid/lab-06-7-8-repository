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
server.use('*',(req,res)=>{
    res.status(404).send('NOT FOUND');
});

server.use((error,req,res)=>{
    res.status(500).send('NOT FOUND');
});