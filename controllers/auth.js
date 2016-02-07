var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy

var User = require('../models/user');

passport.use(new BasicStrategy(
  function(username, password, callback) {

    User.findOne({username:username}, function (err, user){

        if (err) { return callback(err); }

        // No user found with that username
        if(!user) { return callback(null, false); }

        // Make sure the password is correct
        user.verifyPassword(password, function (err, isMatch){
          if (err) { return callback(err) };

          //Password did not match
          if (!isMatch) { return callback(null, false); }

          //success
          return callback(null, user);
        });
    });
  }
));

exports.isAuthenticated = passport.authenticate('basic', {session:false});

passport.use(new BearerStrategy(
  function(jwToken, done){
    var secret = 'alotaksim-secret';
    var decoded = jwt.verify(jwToken, secret);

    console.log('decode:' + util.inspect(decoded));

    User.findOne({username:decoded.sub.username}, function (err, user){
        if (err) { return done(err); }
        // No user found with that username
        if(!user) { return done(null, false); }
        callback(null, user, {scope: '*'});
    });
  })
);

exports.isBearerAuthenticated = passport.authenticate('bearer', {session: false});
