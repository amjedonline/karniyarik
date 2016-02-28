// Load the passenger model
var Passenger = require('../models/passenger');
var moment = require('moment');
var _ = require('underscore');
var util = require('util');

//Create endpoint /api/passengers for POSTS
exports.postPassengers = function(req, res){
  var passenger = new Passenger();

  //set the passenger properties that come from the POST data
  passenger.lname = req.body.lname
  passenger.fname = req.body.fname;
  passenger.email = req.body.email;
  passenger.gender = req.body.gender;
  if ( !_.isEmpty(req.body.dob)){
    // in utc format
    passenger.dob =new Date(req.body.dob);
  }

  passenger.mobile = req.body.mobile;

  passenger.country = req.body.country;
  passenger.state = req.body.state;
  passenger.city = req.body.city;
  passenger.addressline1 = req.body.addressline1;
  passenger.addressline2 = req.body.addressline2;
  passenger.postal = req.body.postal;

  // associate with the current userid
  passenger.userId = req.user._id;

  passenger.createdBy = req.user._id;

  // Save the passenger and check for errors
  passenger.save(function(err){
    if (err){
      console.log('Sending error ' + err);
      res.status(500).send("There was a problem trying to save the passenger object.");
    }
    else{
      // console.log('Sending passenger ' + util.inspect(passenger));
      res.status(200).json(passenger);
    }
  })
};

//get all
exports.getPassengers = function(req, res) {
  //console.log('user: ' + util.inspect(req.user));
  Passenger.find({ userId: req.user._id },function(err, passengers){
    if(err){
      res.status(500).send("There was a problem accessing passengers.");
    }
    else{
      res.status(200).json(passengers);
    }
  })
};

//get one
exports.getPassenger = function(req, res) {
  console.log(util.inspect(req.params));
  Passenger.findOne({ userId: req.user._id, _id: req.params.passenger_id }, function(err, passenger){
    if(err){
      console.log(util.inspect(err));
      res.status(500).send({message: 'There was a problem accessing the passenger.'});
    } else if (!passenger) {
      res.status(404).send({message:'Either a passenger with this id does not exist, or you dont have access rights to this passenger.'});
    } else {
      res.status(200).json(passenger);
    }
  });
};

exports.putPassenger = function(req, res) {
  var allowedFields = ["fname", "lname", "email", "gender", "dob", "mobile", "licensenumber",
        "licenseexpirydate", "insurancenumber", "insuranceexpirydate", "country", "state", "city",
         "addressline1", "addressline2", "postal"];
  var fieldsToUpdate = _.intersection(Object.keys(req.body), allowedFields);
  var reducer = function(map, el){ map[el] = req.body[el]; return map; }
  var keyValuesToUpdate = _.reduce(fieldsToUpdate, reducer, {});

  Passenger.findOne({ userId: req.user._id, _id: req.params.passenger_id }, function(err, passenger){
    if(err){
      res.status(500).send({message: 'There was a problem accessing the passenger.'});
    } else if (!passenger) {
      res.status(404).send({message:'Either a passenger with this id does not exist, or you dont have access rights to this passenger.'});
    } else {
        Passenger.update({userId: req.user._id, _id: req.params.passenger_id}, keyValuesToUpdate ,
        function(err, raw) {
          if (err)
            res.status(500).send({message: 'Requested passenger was either not found or cannot be updated.'});
          else
            res.status(200).json({message: 'Passenger updated.'});
        });
      }
  });
};

exports.deletePassenger = function(req, res) {
  Passenger.findByIdAndRemove(req.params.passenger_id, function(err, passenger){
    if (err)
      res.status(500).send({message: 'There was a problem deleting the passenger.'});
    else if (!passenger)
      res.status(404).send({message: 'Either a passenger cannot be found or you dont have access rights to this passenger.'});
    else
      res.status(200).json({ message: 'Passenger removed!' });
  });
};
