// Load required packages
var User = require('../models/user');
var validator = require('validator');
var _ = require('underscore');
var util = require('util');


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

  User.findOne({email:userReq.email}, function(err, userDoc){
    if(err) {
      res.status(500).send(err);
      return;
    } else if (!userDoc){
      // User does not exist, create a new user and register the scope
      var newUserObject = new User({
        email: userReq.email,
        password: userReq.password,
        registered_scopes: [userReq.scope]
      });
      newUserObject.save(function(err){
        if(err){
          //TODO: control this ?
          if (err.name === 'MongoError' && err.code === 11000) {
            // Duplicate username
            return res.status(400).send({ succes: false, message: 'User with email address already exist.' });
          }
          res.status(500).send({message: 'Cannot create user with given email and password.'});
          console.log(err);
        } else {
          // TODO: go ahead and register the scope (create a corresponding record in partner/driver collection.)
          // This has to an atomic operation, rolling back to deleting the created user and logging the action.
          res.json({message: 'New user added.'});
        }
        return;
      });
    }  else {

      // User already exist
      // If password matches, create the add new scope, register in passenger/driver table.
      // else authentication failed / email already taken.

      // scope already registered
      if(!_.contains(userDoc.registered_scopes, userReq.scope)){
        res.status(400).send({message: 'This email address is already taken.'});
        return;
      }

      // match password
      userDoc.verifyPassword(userReq.password, function (err, isMatch) {
        if(err || !isMatch) {
          res.status(400).send({message: 'This email address is already taken or you are not authenticated to register this role.'});
        } else{
          // Add new scope registration request
          userDoc.registered_scopes.push(userReq.scope)

          var newUserObject = new User({
            email: userReq.email,
            password: userReq.password,
            registered_scopes: [userReq.scope]
          });
          newUserObject.save(function(err){
            if(err){
              //TODO: control this ?
              res.status(500).send({message: 'Cannot create user with given email and password.'});
              console.log(err);
            } else {
              // TODO: go ahead and register the scope (create a corresponding record in partner/driver collection.)
              // This has to be an atomic operation, rolling back to deleting the created user and logging the action.
              // driver/passenger
              res.json({message: 'New user added.'});
            }
            return;
          });
        }
      });
    }
  });


/*  user.save(function(err){
    if(err){
      //TODO: control this ?
      if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate username
        return res.status(400).send({ succes: false, message: 'User with email address already exist.' });
      }
      res.status(500).send({message: 'Cannot create user with given email and password.'});
      console.log(err);
    }else{
      res.json({message: 'New user added.'});
    }
  }); */
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
