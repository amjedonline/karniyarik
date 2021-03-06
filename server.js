// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var driverController = require('./controllers/driver');
var userController = require('./controllers/user');
var passengerController = require('./controllers/passenger');
var taxiController = require('./controllers/taxi');

var jwtController  = require('./controllers/jwt');
var util = require('util');

var passport = require('passport');
var authController = require('./controllers/auth');


// Create our Express application
var app = express();

var env  = app.get('env');
console.log('Karniyarik server starting in profile --------- <' + env + '> ---------');
var config = require('./config').config[env];

function getDbConnectionString(config) {
    return 'mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.name;
}

mongoose.connect(getDbConnectionString(config));
mongoose.connection.on('error', function(err){
  console.log('Mongo connection error!');
  console.log(err);
  process.exit(1);
});

// mongoose.set('debug', true);

if(config.db.name==='development'){
  mongoose.set('debug', function (coll, method, query, doc, options) {
   //do your thing
   console.log('Querying: ' + query);
   console.log('Options: ' + options);
   console.log('Result: ' + util.inspect(doc));
  });
}

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
  .get(authController.isAuthenticated, driverController.getDrivers);

router.route('/drivers/forUser')
  .get(authController.isAuthenticated, driverController.getDriverForUser);

// 1. get one
router.route('/drivers/:driver_id')
  .get(authController.isAuthenticated, driverController.getDriver)
  .put(authController.isAuthenticated, driverController.putDriver)
  .delete(authController.isAuthenticated, driverController.deleteDriver);

//.post(authController.isAuthenticated, passengerController.postPassengers)
router.route('/passengers')
  .get(authController.isAuthenticated, passengerController.getPassengers);

router.route('/passengers/forUser')
    .get(authController.isAuthenticated, passengerController.getPassengerForUser);

// 1. get one
router.route('/passengers/:passenger_id')
  .get(authController.isAuthenticated, passengerController.getPassenger)
  .put(authController.isAuthenticated, passengerController.putPassenger)
  .delete(authController.isAuthenticated, passengerController.deletePassenger);

router.route('/taxis')
  .post(authController.isAuthenticated, taxiController.postTaxis)
  .get(authController.isAuthenticated, taxiController.getTaxis);

// 1. get one
router.route('/taxis/:taxi_id')
  .get(authController.isAuthenticated, taxiController.getTaxi)
  .put(authController.isAuthenticated, taxiController.putTaxi)
  .delete(authController.isAuthenticated, taxiController.deleteTaxi);

/**
Implementing search as a resource.
Although major consensus is to use Post and create search resource.
I find it more sensible to query/get by parameter.
This enables bookmarking and caching.
http://stackoverflow.com/questions/5020704/how-to-design-restful-search-filtering
**/
// 1. search one
router.route('/taxis/searches/bynumber/:number')
  .get(authController.isAuthenticated, taxiController.searchTaxi);

// User request handling
router.route('/users')
  .post(userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers);

// Register all our routes with /api
// http://localhost:3000/api
app.use('/api', router);

// Start the server
app.listen(port);

module.exports = app;
