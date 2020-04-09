'use strict';

var moviesObj ={}
const serverObj = require('./helper.js');
const locationsObj= require('./location.js')

moviesObj.moviesHandler = function(request, response) {
  //If we dont want to get the latitude and longitude from the location api  
  getMovies()
  .then (MoviesArray => response.status(200).json(MoviesArray));
}

function getMovies() {
   let key = process.env.MOVIE_API_KEY;
   console.log(locationsObj.cityGlobel);
   const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${locationsObj.cityGlobel}`;
  return serverObj.superagent.get(url)
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
  module.exports = moviesObj;