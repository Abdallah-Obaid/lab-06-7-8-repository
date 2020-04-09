'use strict';
// Load environment variables from .env
require('dotenv').config();

// Application dependencies
const serverObj = require('./helper.js');
var yelpsObj ={}
const locationsObj= require('./location.js')

yelpsObj.yelpsHandler = function (request, response) {
  //If we dont want to get the latitude and longitude from the location api  
  getYelps(request)
  .then (YelpsArray => response.status(200).json(YelpsArray));
}

function getYelps(req) {
   let key = process.env.YELP_API_KEY;
   const url = `https://api.yelp.com/v3/businesses/search?latitude=${locationsObj.latitude}&longitude=${locationsObj.longitude}}`;
   req.headers.authorization = "Bearer "+ key;
   return serverObj.superagent.get(request)
  .then(data => {
    console.log("data")
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
  .catch(err => {console.log(err)})
}
module.exports = yelpsObj;

  function Yelp (dataa ){
    //  this.title = dataa.title;
    //  this.overview=dataa.overview;
    //  this.average_votes = dataa.vote_average;
    //  this.total_votes = dataa.vote_count;
    //  this.image_url=dataa.poster_path;
    //  this.popularity = dataa.popularity;
    //  this.released_on = dataa.release_date;
  }
