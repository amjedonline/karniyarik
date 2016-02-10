// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var driverController = require('./controllers/driver');
var userController = require('./controllers/user');
var jwtController  = require('./controllers/jwt');

var passport = require('passport');
var authController = require('./controllers/auth');

mongoose.connect('mongodb://localhost:27017/locker');
// Create our Express application
var app = express();

//Use the body-parser package in our application
app.use(bodyParser.json());

//Use the passport package in our application
app.use(passport.initialize());

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Create our Express router
var router = express.Router();

// log using morgan
var morgan = require('morgan')
//app.use(morgan('combined'))

// User Authentication
// User request handling
router.route('/authentication/jwt_token')
  .post(jwtController.createJwtToken);

router.route('/drivers')
  .post(authController.isAuthenticated, driverController.postDrivers)
  .get(authController.isAuthenticated, driverController.getDrivers);

// 1. get one
router.route('/drivers/:driver_id')
  .get(authController.isAuthenticated, driverController.getDriver)
  .put(authController.isAuthenticated, driverController.putDriver)
  .delete(authController.isAuthenticated, driverController.deleteDriver);

// User request handling
router.route('/users')
  .post(authController.isAuthenticated, userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers);

// Register all our routes with /api
// http://localhost:3000/api
app.use('/api', router);

// Start the server
app.listen(port);

module.exports = app;
