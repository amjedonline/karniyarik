// Load the taxi model
var Taxi = require('../models/taxi');
var moment = require('moment');
var _ = require('underscore');
var util = require('util');

//Create endpoint /api/taxis for POSTS
exports.postTaxis = function(req, res){
  var taxi = new Taxi();

  //set the taxi properties that come from the POST data
  taxi.number = req.body.number
  taxi.manufacturer = req.body.manufacturer;
  taxi.model = req.body.model;
  taxi.bodyStyle = req.body.bodyStyle;
  taxi.power = req.body.power;

  taxi.colour = req.body.colour;

  taxi.capacity = req.body.capacity;
  taxi.maximumLuggage = req.body.maximumLuggage;

  if ( !_.isEmpty(req.body.motorExpiry)){
    // in utc format
    taxi.motorExpiry =new Date(req.body.motorExpiry);
  }

  taxi.insuranceNumber = req.body.insuranceNumber;

  if ( !_.isEmpty(req.body.insuranceExpiryDate)){
    // in utc format
    taxi.insuranceExpiryDate =new Date(req.body.insuranceExpiryDate);
  }

  taxi.pcoLicenseNumber = req.body.pcoLicenseNumber;

  if ( !_.isEmpty(req.body.pcoLicenseExpiryDate)){
    // in utc format
    taxi.pcoLicenseExpiryDate =new Date(req.body.pcoLicenseExpiryDate);
  }
  taxi.status = req.body.status;

  taxi.createdBy = req.user._id;

  // Save the taxi and check for errors
  taxi.save(function(err){
    if (err){
      console.log('Sending error ' + err);
      res.status(500).send("There was a problem trying to save the taxi object.");
    }
    else{
      // console.log('Sending taxi ' + util.inspect(taxi));
      res.status(200).json(taxi);
    }
  })
};

//get all
exports.getTaxis = function(req, res) {
  Taxi.find({}, function(err, taxis) {
    if(err) {
      res.status(500).send("There was a problem accessing taxis.");
    } else {
      res.status(200).json(taxis);
    }
  })
};

//get one
exports.getTaxi = function(req, res) {
  var taxiId = req.params.taxi_id;
  if(!taxiId){
    res.status(401).send({message:'Invalid request, need a valid taxi id.'});
    return;
  }

  Taxi.findOne({ _id: taxiId }, function(err, taxi) {
    if(err){
      res.status(500).send({message: 'There was a problem accessing the taxi.'});
    } else if (!taxi) {
      res.status(404).send({message:'Either a taxi with this id does not exist, or you dont have access rights to this taxi.'});
    } else {
      res.status(200).json(taxi);
    }
  });
};


// search taxi
exports.searchTaxi = function(req, res) {
  if(!req.params.number){
      res.status(401).send({message:'Invalid request, need a valid Taxinumber to search for.'});
      return;
  }

  Taxi.findOne({ number: req.params.number }, function(err, taxi){
    if(err){
      res.status(500).send({message: 'There was a problem accessing the taxi.'});
    } else if (!taxi) {
      res.status(200).json([]);
    } else {
      res.status(200).json([taxi]);
    }
  });
};

exports.putTaxi = function(req, res) {
  var allowedFields = ["number", "manufacturer", "model", "bodyStyle", "power", "colour", "capacity",
        "maximumLuggage", "motorExpiry", "insuranceNumber", "insuranceExpiryDate", "pcoLicenseNumber", "pcoLicenseExpiryDate",
         "status"];
  var fieldsToUpdate = _.intersection(Object.keys(req.body), allowedFields);
  var reducer = function(map, el){ map[el] = req.body[el]; return map; }
  var keyValuesToUpdate = _.reduce(fieldsToUpdate, reducer, {});

  Taxi.findOne({ _id: req.params.taxi_id }, function(err, taxi){
    if(err){
      res.status(500).send({message: 'There was a problem accessing the taxi.'});
    } else if (!taxi) {
      res.status(404).send({message:'Either a taxi with this id does not exist, or you dont have access rights to this taxi.'});
    } else {
        Taxi.update({_id: req.params.taxi_id}, keyValuesToUpdate ,
        function(err, raw) {
          if (err)
            res.status(500).send({message: 'Requested taxi was either not found or cannot be updated.'});
          else
            res.status(200).json({message: 'Taxi updated.'});
        });
      }
  });
};

exports.deleteTaxi = function(req, res) {
  Taxi.findByIdAndRemove(req.params.taxi_id, function(err, taxi){
    if (err)
      res.status(500).send({message: 'There was a problem deleting the taxi.'});
    else if (!taxi)
      res.status(404).send({message: 'Either a taxi cannot be found or you dont have access rights to this taxi.'});
    else
      res.status(200).json({ message: 'Taxi removed!' });
  });
};
