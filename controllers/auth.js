
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;

var User = require('../models/user');

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

exports.isAuthenticated = passport.authenticate('bearer', {session: false});
