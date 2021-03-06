// Pull in modules and declare constants
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const router = require('./router');

const app = express();


// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use router
app.use('/', router);



// Export Server
module.exports = app;