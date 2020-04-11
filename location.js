'use strict';

var locationsObj ={}
const serverObj = require('./helper.js');

// localhost:3030/location?city=Lynnwood
locationsObj.locationHandler=function(request, response) {
  const city = request.query.city;
  let loc;
  serverObj.client.query("SELECT * FROM locations WHERE search_query = $1;",
   [city],
   (error, result) => {
     loc = result.rows[0];
     if (loc == undefined){
     console.log(loc)
     getLocation(city)
     .then (locationData =>{ 
      serverObj.client.query("INSERT INTO locations (formatted_query,search_query,latitude,longitude) VALUES ($1,$2,$3,$4);",
       [locationData.formatted_query,locationData.search_query,locationData.latitude,locationData.longitude],
       (error, result) => {
         loc =locationData;});
         response.status(200).json(loc)
       })
   }else{
    locationsObj.longitude = loc.longitude;
    locationsObj.latitude  = loc.latitude;
    locationsObj.cityGlobel = loc.search_query;
       response.status(200).json(loc)
   }
   });
 };
 
 function getLocation(city){
 let key = process.env.GEOCODE_API_KEY;
 const url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
   
 return serverObj.superagent.get(url)
 .then(geoData => {
     const locationData = new Location(city,geoData.body);
     locationsObj.longitude = locationData.longitude;
     locationsObj.latitude =locationData.latitude;
     locationsObj.cityGlobel = locationData.search_query;
     return locationData;
 })
 }
 
  function Location(city,Data){
     this.search_query = city;
     this.formatted_query = Data[0].display_name;
     this.latitude= Data[0].lat;
     this.longitude = Data[0].lon;
  }
  module.exports= locationsObj;