// Load the driver model
var Driver = require('../models/driver');
var moment = require('moment');
var _ = require('underscore');
var util = require('util');

// get all
exports.getDrivers = function(req, res) {
  //console.log('user: ' + util.inspect(req.user));
  Driver.find({ userId: req.user._id },function(err, drivers){
    if(err){
      res.status(500).send("There was a problem accessing drivers.");
    }
    else{
      res.status(200).json(drivers);
    }
  })
};

// get one
exports.getDriver = function(req, res) {
  Driver.findOne({ userId: req.user._id, _id: req.params.driver_id }, function(err, driver){
    if(err){
      res.status(500).send({message: 'There was a problem accessing the driver.'});
    } else if (!driver) {
      res.status(404).send({message:'Either a driver with this id does not exist, or you dont have access rights to this driver.'});
    } else {
      res.status(200).json(driver);
    }
  });
};

// get one
exports.getDriverForUser = function(req, res) {
  console.log(req.user._id);
  Driver.findOne({userId: req.user._id}, function(err, driverDoc){
    if(err){
      console.log(util.inspect(err));
      res.status(500).send({message: 'There was a problem accessing the passenger.'});
    } else if (!driverDoc) {
      res.status(404).send({message:'Either a driver with this id does not exist, or you dont have access rights to this driver.'});
    } else {
      res.status(200).json(driverDoc);
    }
  });
};

exports.putDriver = function(req, res) {
  var allowedFields = ["fname", "lname", "gender", "dob", "mobile", "licensenumber",
        "licenseexpirydate", "insurancenumber", "insuranceexpirydate", "country", "state", "city",
         "addressline1", "addressline2", "postal"];
  var fieldsToUpdate = _.intersection(Object.keys(req.body), allowedFields);
  var reducer = function(map, el){ map[el] = req.body[el]; return map; }
  var keyValuesToUpdate = _.reduce(fieldsToUpdate, reducer, {});

  Driver.findOne({ userId: req.user._id, _id: req.params.driver_id }, function(err, driver){
    if(err){
      res.status(500).send({message: 'There was a problem accessing the driver.'});
    } else if (!driver) {
      res.status(404).send({message:'Either a driver with this id does not exist, or you dont have access rights to this driver.'});
    } else {
        Driver.update({userId: req.user._id, _id: req.params.driver_id}, keyValuesToUpdate ,
        function(err, raw) {
          if (err)
            res.status(500).send({message: 'Requested driver was either not found or cannot be updated.'});
          else
            res.status(200).json({message: 'Driver updated.'});
        });
      }
  });
};

exports.deleteDriver = function(req, res) {
  Driver.findByIdAndRemove(req.params.driver_id, function(err, driver){
    if (err){
      console.log(util.inspect(err));
      res.status(500).send({message: 'There was a problem deleting the driver.'});
    } else if (!driver) {
      res.status(404).send({message: 'Either a driver cannot be found or you dont have access rights to this driver.'});
    } else {
      res.status(200).json({ message: 'Driver removed!' });
    }
  });
};
