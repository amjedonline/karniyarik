
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var jsonwebtoken = require('jsonwebtoken');
var util = require('util');

var s = require("underscore.string");

var User = require('../models/user');

passport.use(new BearerStrategy(
  { passReqToCallback: true },
  function(req, jwToken, done){
    var secret = 'alotaksim-secret';
    var decodedToken = jsonwebtoken.verify(jwToken, secret);


    User.findOne({username:decodedToken.username}, function (err, user) {
        if (err) { return done(err); }

        // No user found with that username
        if(!user) { return done(null, false); }

        //TODO: RegistrationId in header is defined
        var registrationIdInHeader = req.get('RegistrationId');
        if(!registrationIdInHeader){
          return done('Registration id not given.', false);
        }

        // console.log(util.inspect(decodedToken));
        var registrationIdsMatch = (registrationIdInHeader===decodedToken.registration_id);
        console.log('Registration id match: ' + registrationIdsMatch);
        if(!registrationIdsMatch){
          console.log('Did not match and return =ing false/');
          return done('Registration Id does not match.', false);
        }
        done(null, user);
    });
  })
);

exports.isAuthenticated = passport.authenticate('bearer', {session: false});
