
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var jsonwebtoken = require('jsonwebtoken');
var util = require('util');

var User = require('../models/user');

passport.use(new BearerStrategy(
  function(jwToken, done){
    //console.log('Got token: ' + jwToken)
    var secret = 'alotaksim-secret';
    var decoded = jsonwebtoken.verify(jwToken, secret);

    // console.log('decode:' + util.inspect(decoded));
    User.findOne({username:decoded.username}, function (err, user) {
        if (err) { return done(err); }
        // No user found with that username
        if(!user) { return done(null, false); }
        done(null, user);
    });
  })
);

exports.isAuthenticated = passport.authenticate('bearer', {session: false});
