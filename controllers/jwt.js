
var jsonwebtoken = require('jsonwebtoken');
var util = require('util');
var ms = require('ms');

var createJwtResponse = function(user) {

  var validityInMs = ms('7d')
  var options = { notBefore: validityInMs, issuer: 'Alotaksim/Karniyarik', subject: user.username };
  var payload = { username: user.username };
  var secret = 'alotaksim-secret';
  var token = jsonwebtoken.sign( payload, secret );

  var validTillDate = new Date().getTime() + validityInMs;

  var tokenResponse = {token:token, token_type: 'JWT', valid_till: validTillDate};
  return tokenResponse;
};

exports.sendJWTInBody = function(req, res) {
  var tokenResponse = createJwtResponse(req.user);
  res.json(tokenResponse);
};
