'use strict';
const serverObj = require('./helper.js');
const locationsObj= require('./location.js');
const weatherObj= require('./weather.js');
const trailsObj = require('./trails.js');
const moviesObj = require('./movies.js');
const yelpsObj = require('./yelps.js');

serverObj.server.get('/',(request,response) => {
    response.send('IT WORK');
});

//Route definitions

serverObj.server.get('/location',locationsObj.locationHandler);
serverObj.server.get('/weather',weatherObj.weatherHandler);
serverObj.server.get('/trails',trailsObj.trailsHandler);
serverObj.server.get('/movies',moviesObj.moviesHandler);
serverObj.server.get('/yelp', yelpsObj.yelpsHandler);

//Make sure the server is listening for requests
serverObj.client.connect()
.then(()=>{
  serverObj.server.listen(serverObj.PORT, () => console.log(`App is listening on ${serverObj.PORT}`));})


serverObj.server.use('*',(req,res)=>{
  res.status(404).send('Go kill your self :*(');
});

serverObj.server.use((error,req,res)=>{
  res.status(500).send('Sorry, something went wrong');
});