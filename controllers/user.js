// Load required packages
var User = require('../models/user');
var validator = require('validator');
var _ = require('underscore');
var util = require('util');


// Create endpoint /api/users for POST
exports.postUsers = function(req, res) {
  var user = new User({
    email: req.body.email,
    password: req.body.password
  });

  if(!validator.isEmail(user.email) ){
    res.status(400).send({message: 'Email field should be a valid email address.'});
    return;
  }

  if(_.isEmpty(user.password) || user.password.length < 5 || user.password.length > 50){
    res.status(400).send({message: 'Password should be atleast 5 characters and at most 50 characters long.'});
    return;
  }


  user.save(function(err){
    if(err){
      res.status(500).send({message: 'Cannot create user with given email and password.'});
      console.log(err);
    }else{
      res.json({message: 'New user added.'});
    }
  });
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
