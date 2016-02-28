// Load required packages
var User = require('../models/user');
var Passenger = require('../models/passenger');
var validator = require('validator');
var _ = require('underscore');
var util = require('util');

var initPassenger = function(userId, callback){
  var passenger = new Passenger();
  passenger.status = 'notverified';
  passenger.userId = userId;
  // Save the passenger and check for errors
  passenger.save(function(err){
    if (err){
      callback({ERROR_CODE:ERR_PASSENGER_PROFILE_INIT, message: 'Cannot initialize passenger profile object.'});
    }
    else{
      console.log('Created passenger.');
      callback(null);
    }
  });
};

var initDriver = function(userId, callback){
  var driver = new Driver();
  driver.status = 'inactive';
  driver.userId = userId;
  // Save the passenger and check for errors
  driver.save(function(callback){
    if (err){
      callback({ERROR_CODE:ERR_DRIVER_PROFILE_INIT, message: 'Cannot initialize driver profile object.'});
    }
    else{
      console.log('Created driver.');
      callback(null);
    }
  });
};

// Create endpoint /api/users for POST
exports.postUsers = function(req, res) {
  var userReq = {
    email: req.body.email,
    password: req.body.password,
    scope: req.body.scope
  };

  if(!validator.isEmail(userReq.email) ){
    res.status(400).send({message: 'Email field should be a valid email address.'});
    return;
  }

  if(_.isEmpty(userReq.password) || userReq.password.length < 5 || userReq.password.length > 50){
    res.status(400).send({message: 'Password should be atleast 5 characters and at most 50 characters long.'});
    return;
  }

  if(!_.contains(['driver', 'passenger'], userReq.scope)){
    // console.log(util.inspect(userReq));
    res.status(400).send({message: 'Invalid scope registration request.'});
    return;
  }

  var userNotExistHandler = function(userReq, res) {
    // User does not exist, create a new user and register the scope
    var newUserObject = new User({
      email: userReq.email,
      password: userReq.password,
      registered_scopes: [userReq.scope]
    });
    newUserObject.save(function(err){
      if(err){
        if (err.name === 'MongoError' && err.code === 11000) {
          // Duplicate username
          res.status(400).send({ succes: false, message: 'User with email address already exist.' });
        } else {
          res.status(500).send({message: 'Cannot create user with given email and password.'});
          console.log(err);
        }
        return
      }

      // TODO: go ahead and register the scope (create a corresponding record in partner/driver collection.)
      // This has to an atomic operation, rolling back to deleting the created user and logging the action.
      if (userReq.scope === 'driver'){
        initDriver(newUserObject._id, function(err){
          if(err)
            res.status(500).send({message: 'Cannot Grant scope or initialize the scoped profile.'});
          else
            res.status(200).send({message: 'Registration successful.'});
        });
      } else if (userReq.scope === 'passenger') {
        initPassenger(newUserObject._id, function(err){
          if(err)
            res.status(500).send({message: 'Cannot Grant scope or initialize the scoped profile.'});
          else
            res.status(200).send({message: 'Registration successful.'});
        });
      }
    });
  };

  var userExistHandler = function(userDoc, res) {
    // User already exist

    // scope already registered
    if(!_.contains(userDoc.registered_scopes, userReq.scope)){
      res.status(400).send({message: 'This email address is already taken.'});
      return;
    }

    // If password matches, create the add new scope, initialize passenger/driver.

    // Add new scope registration request
    var userScopeGrant = function(callback){
      userDoc.registered_scopes.push(userReq.scope);
      userDoc.save(function(err){
        if(err){
          callback(err);
        } else {
          callback(null);
        }
      });
    };

    var scopedProfileInitializer = function (callback) {
      if (userReq.scope === 'driver'){
        initDriver(userDoc._id, function(err){
          if(err)
            callback(err);
          else
            callback(null);
        });
      } else if (userReq.scope === 'passenger') {
        initPassenger(userDoc._id, function(err){
          if(err)
            callback(err);
          else
            callback(null);
        });
      }
    };

    var passwordVerification = function (err, isMatch) {
      if(err || !isMatch) {
        res.status(400).send({message: 'This email address is already taken or you are not authenticated to register this role.'});
        return;
      }
      async.series([userScopeGrant, scopedProfileInitializer], function(err) {
        if (err)
          res.status(500).send({message: 'Cannot Grant scope or initialize the scoped profile.'});
        else {
          res.json({message: 'New user added.'});
        }
      });
    };
    // match password
    userDoc.verifyPassword(userReq.password, passwordVerification);
  }

  var userFindOneCallback = function(err, userDoc){
    if(err) {
      res.status(500).send(err);
      return;
    } else if (!userDoc){
      userNotExistHandler(userReq, res);
    }  else {
      userExistHandler(userDoc, res);
    }
  };
  User.findOne({email:userReq.email},userFindOneCallback);
};

// Create endpoint /api/users for Get
exports.getUsers = function(req, res){
  User.find(function(err, users){
    if(err)
      res.status(500).send(err);
    else
      res.json(users);
  });
};
