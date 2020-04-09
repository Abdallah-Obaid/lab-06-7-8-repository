'use strict';

// Load environment variables from .env
require('dotenv').config();
//obj for server
let serverObj = {};
// Application dependencies
serverObj.express = require('express');
serverObj.cors = require('cors');
serverObj.superagent = require('superagent');
serverObj.pg = require('pg');
// Application setup
serverObj.PORT = process.env.PORT;
serverObj.server =  serverObj.express();
serverObj.server.use(serverObj.cors());
serverObj.client = new serverObj.pg.Client(process.env.DATABASE_URL);
module.exports = serverObj;