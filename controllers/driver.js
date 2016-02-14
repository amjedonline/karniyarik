// Load the driver model
var Driver = require('../models/driver');
var moment = require('moment');
var _ = require('underscore');
var util = require('util');

//Create endpoint /api/drivers for POSTS
exports.postDrivers = function(req, res){
  var driver = new Driver();

  //set the driver properties that come from the POST data
  driver.lname = req.body.lname
  driver.fname = req.body.fname;
  driver.email = req.body.email;
  driver.gender = req.body.gender;
  if ( !_.isEmpty(req.body.dob)){
    // in utc format
    driver.dob =new Date(req.body.dob);
  }

  driver.mobile = req.body.mobile;
  driver.licensenumber = req.body.licensenumber;
  if ( !_.isEmpty(req.body.licenseexpirydate)){
    // in utc format
    driver.licenseexpirydate = new Date(req.body.licenseexpirydate);
  }

  driver.insurancenumber = req.body.insurancenumber;
  if ( !_.isEmpty(req.body.insuranceexpirydate)){
    // in utc format
    driver.insuranceexpirydate = new Date(req.body.insuranceexpirydate);
  }

  driver.country = req.body.country;
  driver.state = req.body.state;
  driver.city = req.body.city;
  driver.addressline1 = req.body.addressline1;
  driver.addressline2 = req.body.addressline2;
  driver.postal = req.body.postal;

  // associate with the current userid
  driver.userId = req.user._id;

  driver.createdBy = req.user._id;

  // Save the driver and check for errors
  driver.save(function(err){
    if (err){
      // console.log('Sending error ' + err);
      res.status(500).send("There was a problem trying to save the Driver object.");
    }
    else{
      // console.log('Sending driver ' + util.inspect(driver));
      res.status(200).json(driver);
    }
  })
};

//get all
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

//get one
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

exports.putDriver = function(req, res) {
  var allowedFields = ["fname", "lname", "email", "gender", "dob", "mobile", "licensenumber",
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
    if (err)
      res.status(500).send({message: 'There was a problem deleting the driver.'});
    else if (!driver)
      res.status(404).send({message: 'Either a driver cannot be found or you dont have access rights to this driver.'});
    else
      res.status(200).json({ message: 'Driver removed!' });
  });
};
