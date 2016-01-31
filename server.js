// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Beer = require('./models/beer');

mongoose.connect('mongodb://localhost:27017/locker');
// Create our Express application
var app = express();

//Use the body-parser package in our application
app.use(bodyParser.json());



// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Create our Express router
var router = express.Router();

// Initial dummy route for testing
// http://localhost:3000/api
router.get('/', function(req, res) {
  res.json({ message: 'You are running dangerously low on beer!' });
});


// Add /beers route request handling
var beersRoute = router.route('/beers');

//Create endpoint /api/beers for POSTS
beersRoute.post(function(req, res){
  var beer = new Beer();

  //set the beer properties that come from the POST data
  beer.name = req.body.name;
  beer.type = req.body.type;
  beer.quantity = req.body.quantity;

  // Save the beer and check for errors
  beer.save(function(err){
    if (err)
      res.send(err);

    res.json({message: 'Beer added to the locker!', data:beer });
  })

});


//get all
beersRoute.get(function(req, res){
  Beer.find(function(err, beers){
    if(err)
      res.send(err);
    res.json(beers);
  })
});


//get one
var beerRoute = router.route('/beers/:beer_id');
beerRoute.get(function(req, res) {
  Beer.findById(req.params.beer_id, function(err, beer){
    if (err)
      res.send(err)
    res.json(beer);
  });
});

beerRoute.put(function(req, res) {
  Beer.findById(req.params.beer_id, function(err, beer){
    if (err)
      res.send(err)

    beer.quantity = req.body.quantity;

    // Let us now save the beer
    beer.save(function(err){
      if (err)
        res.send(err)
      res.json(beer);
    });
  });
});

// Register all our routes with /api
app.use('/api', router);

// Start the server
app.listen(port);
console.log('Insert beer on port ' + port);
