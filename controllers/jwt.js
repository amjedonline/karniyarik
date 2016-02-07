
var jwt = require('jsonwebtoken');

exports.createJwt = function(req, res) {

  // testing
  console.log(util.inspect(user));

  var options = { algorithm: 'RS256' };
  var payload = {username: req.user.username, iss: 'Alotaksim' };
  var secret = 'alotaksim-secret';
  var token = jwt.sign( payload, secret, options );

  console.log('Step 1: '+token);
  res.json(token);
};
