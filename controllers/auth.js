
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var jsonwebtoken = require('jsonwebtoken');
var util = require('util');

var User = require('../models/user');

passport.use(new BearerStrategy({ passReqToCallback: true },
  function(req, jwToken, done){
    var secret = 'alotaksim-secret';
    var decodedToken = jsonwebtoken.verify(jwToken, secret);
    // console.log(util.inspect(decodedToken));

    User.findOne({email:decodedToken.email}, function (err, user) {
        if (err) { return done(err); }

        // No user found with that email
        if(!user) { return done(null, false); }

        // RegistrationId in header is defined
        var registrationIdInHeader = req.get('RegistrationId');
        if(!registrationIdInHeader){
          // Registration id not given
          return done(null, false);
        }

        var registrationIdsMatch = (registrationIdInHeader===decodedToken.registration_id);
        if(!registrationIdsMatch){
          // Registration Id does not match
          return done(null, false);
        }
        done(null, user);
    });
  })
);

exports.isAuthenticated = passport.authenticate('bearer', {session: false});
