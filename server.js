// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var beerController = require('./controllers/beer');
var userController = require('./controllers/user');

mongoose.connect('mongodb://localhost:27017/locker');
// Create our Express application
var app = express();

//Use the body-parser package in our application
app.use(bodyParser.json());

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Create our Express router
var router = express.Router();


// Add /beers route request handling
// 1. post one beer
// 2. get all beers
router.route('/beers')
  .post(beerController.postBeers)
  .get(beerController.getBeers);


//1. get one
router.route('/beers/:beer_id')
  .get(beerController.getBeer)
  .put(beerController.putBeer)
  .delete(beerController.deleteBeer);

// User request handling
router.route('/users')
  .post(userController.postUsers)
  .get(userController.getUsers)
// Register all our routes with /api
// http://localhost:3000/api
app.use('/api', router);

// Start the server
app.listen(port);
