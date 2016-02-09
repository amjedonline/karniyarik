
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var should = chai.should();
var assert = chai.assert;

var _ = require('underscore');
var util = require('util');


chai.use(chaiHttp);

describe('Basic Authentication for token generation', function() {
    it('should create a valid JWT token and send response', function (done) {
        chai.request(server)
        .post('/api/authentication/jwt_token')
        .auth('amjed', 'amjed')
        .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');

            var tokenResponse = res.body;
            console.log(util.inspect(_.keys(tokenResponse)));

            var containsAllKeys = _.every(
                ['token', 'token_type', 'valid_till'],
                function(key){
                  return _.contains(this, key)
                },
                _.keys(tokenResponse)
            );

            assert.isTrue(containsAllKeys, "The token response object has all the expected keys.");
            var validTillActual = new Date(tokenResponse.valid_till);
            var validTillExpected = new Date();
            validTillExpected.setDate(validTillExpected.getDate() + 3);

            assert.isTrue(validTillActual > validTillExpected, 'Created token has atleast 3 days validlity.');

            assert.isNotNull(tokenResponse.token, 'The JWT token is not empty');
            assert.isString(tokenResponse.token, 'The JWT token is a string.');
            done();
        });
    });
});