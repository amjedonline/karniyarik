
var jsonwebtoken = require('jsonwebtoken');
var util = require('util');
var ms = require('ms');
var _ = require('underscore');
var User = require('../models/user');


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
  console.log('Got username/password: ' + username + '/' + password);
  
  var registrationId = req.body.registration_id;

  User.findOne({username:username}, function (err, user) {

      if (err) {
        return res.status(500).send({
          'ERR_CODE':'UNKNOWN',
          message:'There was a problem retrieving the user information.'
        });
      }

      // No user found with that username
      if (!user) {
        console.log('no user found.');
        return res.status(400).send({
          'ERR_CODE':'USERNAME_PASSWORD_NOT_MATCH',
          message:'Usename and password does not match.'
        });
      }

      // Make sure the password is correct
      user.verifyPassword(password, function (err, isMatch) {
        if (err) {
          console.log('while verification.');
          return res.status(400).send({
            'ERR_CODE':'USERNAME_PASSWORD_NOT_MATCH',
            message:'Usename and password does not match.'
          });
        };

        //Password did not match
        if (!isMatch) {
          console.log('Do not match.');
          return res.status(400).send({
            'ERR_CODE':'USERNAME_PASSWORD_NOT_MATCH',
            message:'Usename and password does not match.'
          });
        }

      });

      if( !_.isString(registrationId)){
        console.log('registration id not string..');
        return res.status(400).send({
          'ERR_CODE':'MISSING_REG_ID',
          message:'Expecting a Registration Id.'
        });
      }

      //success
      var tokenResponse = createResponseObject(user, registrationId);
      res.json(tokenResponse);

  });

};
