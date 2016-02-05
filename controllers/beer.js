// Load the beer model
var Beer = require('../models/beer');

//Create endpoint /api/beers for POSTS
exports.postBeers = function(req, res){
  var beer = new Beer();

  //set the beer properties that come from the POST data
  beer.name = req.body.name;
  beer.type = req.body.type;
  beer.quantity = req.body.quantity;
  beer.userId = req.user._id;

  // Save the beer and check for errors
  beer.save(function(err){
    if (err)
      res.send(err);
    else
      res.json({message: 'Beer added to the locker!', data:beer });
  })
};

//get all
exports.getBeers = function(req, res) {
  Beer.find({ userId: req.user._id },function(err, beers){
    if(err)
      res.send(err);
    else
      res.json(beers);
  })
};

//get one
exports.getBeer = function(req, res) {
  Beer.findById({ userId: req.user._id, _id: req.params.beer_id }, function(err, beer){
    if (err)
      res.send(err)
    else
      res.json(beer);
  });
};

exports.putBeer = function(req, res) {
  Beer.update({userId: req.user._id, _id: req.params.beer_id}, { quantity: req.body.quantity },
      function(err, num, raw) {
        if (err)
          res.send(err)
        else
          res.json({message: 'Updated the beer.'});
    });
};

exports.deleteBeer = function(req, res) {
  Beer.findByIdAndRemove(req.params.beer_id, function(err, beer){
    if (err)
      res.send(err)
    else
      res.json({ message: 'Beer removed from the locker!' });
  });
};
