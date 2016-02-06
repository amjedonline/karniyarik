// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var driverController = require('./controllers/driver');
var userController = require('./controllers/user');

var passport = require('passport');
var authController = require('./controllers/auth');

mongoose.connect('mongodb://localhost:27017/locker');
// Create our Express application
var app = express();

//Use the body-parser package in our application
app.use(bodyParser.json());

//Use the passport package in out application
app.use(passport.initialize());

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Create our Express router
var router = express.Router();

// User Authentication
// User request handling
router.route('/users/authenticate')
  .post(authController.isAuthenticated, jwtController.createJwtToken);

router.route('/drivers')
  .post(authController.isBearerAuthenticated, driverController.postDrivers)
  .get(authController.isBearerAuthenticated, driverController.getDrivers);

// 1. get one
router.route('/drivers/:drivers_id')
  .get(authController.isBearerAuthenticated, driverController.getDriver)
  .put(authController.isBearerAuthenticated, driverController.putDriver)
  .delete(authController.isBearerAuthenticated, driverController.deleteDriver);

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
