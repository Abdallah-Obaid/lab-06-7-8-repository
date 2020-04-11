'use strict';
const serverObj = require('./helper.js');
var trailsObj ={}
const locationsObj= require('./location.js')

trailsObj.trailsHandler = function(request, response) {
  //If we dont want to get the latitude and longitude from the location api
  let latitude = locationsObj.latitude; 
  let longitude = locationsObj.longitude; 

  getTrail(latitude,longitude)
  .then (trailArray => response.status(200).json(trailArray));
}

function getTrail(latitude,longitude) {
   console.log(longitude,latitude,"hi");
   let key = process.env.TRAIL_API_KEY;
   const url = `https://www.hikingproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxDistance=500&key=${key}`;
  return serverObj.superagent.get(url)
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
  
  module.exports= trailsObj;
