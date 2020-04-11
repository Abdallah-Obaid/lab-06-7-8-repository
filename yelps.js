'use strict';
// Load environment variables from .env
require('dotenv').config();
// Application dependencies
const serverObj = require('./helper.js');
var yelpsObj ={};
const locationsObj= require('./location.js')

yelpsObj.yelpsHandler = function (request, response) {
  //If we dont want to get the latitude and longitude from the location api  
  getYelps(request)
  .then (YelpsArray => response.status(200).json(YelpsArray));
}

function getYelps(req) {
   let key = process.env.YELP_API_KEY;
  //  console.log(locationsObj.cityGlobel);
   return serverObj.superagent.get(`https://api.yelp.com/v3/businesses/search?location=${locationsObj.cityGlobel}`).set({ "Authorization": `Bearer ${key}` })
  .then(data => {
     let YelpsArray = [];
        data.body.businesses.forEach(val =>{
        if(YelpsArray.length === 20){
          return YelpsArray;
        }
        const YelpData = new Yelp(val);
        YelpsArray.push(YelpData)
        })
        // console.log("data",YelpsArray)
        return YelpsArray;
  })
  .catch(err => {console.log(err)})
}
module.exports = yelpsObj;

  function Yelp (dataa ){
     this.name = dataa.name;
     this.image_url=dataa.image_url;
     this.price = dataa.price;
     this.rating = dataa.rating;
     this.url = dataa.url;
  }