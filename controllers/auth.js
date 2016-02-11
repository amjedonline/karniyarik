
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

        // TODO: Check the registrationId from the header with the registration id from the token.
        // console.log('Here..'+ util.inspect(req));
        var registrationIdInHeader = req.get('RegistrationId');
        // console.log('decode:' + util.inspect(decodedToken));
        // console.log(decodedToken.registration_id);
        var registrationIdsMatch = (registrationIdInHeader===decodedToken.registration_id);
        console.log('Registration id match: '+registrationIdsMatch);
        if(!registrationIdsMatch ){
          console.log('Did not match and return =ing false/');
          return done(null, false);
        }
        done(null, user);
    });
  })
);

exports.isAuthenticated = passport.authenticate('bearer', {session: false});
