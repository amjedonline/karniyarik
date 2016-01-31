// Load the beer model
var Beer = require('../models/beer');


//Create endpoint /api/beers for POSTS
exports.postBeers = function(req, res){
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
};


//get all
exports.getBeers = function(req, res) {
  Beer.find(function(err, beers){
    if(err)
      res.send(err);
    res.json(beers);
  })
};


//get one
exports.getBeer = function(req, res) {
  Beer.findById(req.params.beer_id, function(err, beer){
    if (err)
      res.send(err)
    res.json(beer);
  });
};

exports.putBeer = function(req, res) {
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
};

exports.deleteBeer = function(req, res) {
  Beer.findByIdAndRemove(req.params.beer_id, function(err, beer){
    if (err)
      res.send(err)
    res.json({ message: 'Beer removed from the locker!' });
  });
};
