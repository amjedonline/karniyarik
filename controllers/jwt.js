
var jsonwebtoken = require('jsonwebtoken');
var util = require('util');
var ms = require('ms');
var _ = require('underscore');
var User = require('../models/user');

var async = require('async');

// TODO: Need to catch possible exceptions here
var createResponseObject = function(user, registrationId) {

  var validityInMs = ms('7d')
  var options = { notBefore: validityInMs, issuer: 'Alotaksim/Karniyarik', subject: user.username };

  var payload = { username: user.username, gcm_registraion_id: registrationId };
  var secret = 'alotaksim-secret';
  var token = jsonwebtoken.sign( payload, secret );

  var validTillDate = new Date().getTime() + validityInMs;

  var tokenResponse = {token:token, token_type: 'JWT', valid_till: validTillDate};
  return tokenResponse;
};

exports.createJwtToken = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var registrationId = req.body.registration_id;

  User.findOne({username:username}, function (err, user) {
      if (err) {
        res.status(500).send({
          'ERR_CODE':'UNKNOWN',
          message:'There was a problem retrieving the user information.'
        });
        return;
      }

      // No user found with that username
      var userCheck = function(callback){
        if (!user)
          callback({
            'ERR_CODE':'USERNAME_PASSWORD_NOT_MATCH',
            message:'Usename and password does not match.'
          });
         else
          callback(null);
      };

      var verifyPass = function(callback) {
        user.verifyPassword(password, function (err, isMatch) {
          if(err || !isMatch) {
            callback({
              'ERR_CODE':'USERNAME_PASSWORD_NOT_MATCH',
              message:'Usename and password does not match.'
            });
          } else {
            callback(null);
          }
        });
      };

      var checkRegistrationId = function (callback){
        if( !_.isString(registrationId)){
          callback({
            'ERR_CODE':'MISSING_REG_ID',
            message:'Expecting a Registration Id.'
          });
        } else {
          callback(null);
        }
      };

      var seriesCallback = function(err){
        if(err){
          res.status(400).send(err);
          return;
        }
      }

      //success
      var success = function (callback) {
        var tokenResponse = createResponseObject(user, registrationId);
        res.json(tokenResponse);
        callback(null);
      };

      async.series( [ userCheck, verifyPass, checkRegistrationId, success ], seriesCallback);

  });
};
