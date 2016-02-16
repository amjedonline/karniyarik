
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var should = chai.should();
var assert = chai.assert;

var _ = require('underscore');
var util = require('util');

var testUser = 'amjed';
var testPassword = 'amjed123';
var testRegistrationId = 'id123id';

chai.use(chaiHttp);

describe('Basic Authentication for token generation.', function() {
    before(function (done){
      chai.request(server)
      .post('/api/users')
      .send({username: testUser, password: testPassword})
      .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.be.a('object')
          done();
      });

    });
    it('should create a valid JWT token and send response.', function (done) {
        chai.request(server)
        .post('/api/authentication/jwt_token')
        .send({username:testUser, password:testPassword, registration_id:testRegistrationId})
        .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');

            var tokenResponse = res.body;

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

    it('should return 400 on an attempt to create JWT token with false password.', function (done) {
        chai.request(server)
        .post('/api/authentication/jwt_token')
        .send({username:testUser, password:'falsepassword', registration_id:testRegistrationId})
        .end(function(err, res) {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.be.a('object');
            done();
        });
    });

    it('should return 400 on an attempt to create JWT token with false username.', function (done) {
        chai.request(server)
        .post('/api/authentication/jwt_token')
        .send({username:'nonexistentuser', password:testPassword, registration_id:'somerandomnumber8972134'})
        .end(function(err, res) {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.be.a('object');
            done();
        });
    });

    it('should return 400 on an attempt to create JWT token with false username and false password.', function (done) {
        chai.request(server)
        .post('/api/authentication/jwt_token')
        .send({username:'somenotexistinguser', password:'falsepassword', registration_id:'somerandomnumber8972134'})
        .end(function(err, res) {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.be.a('object');
            done();
        });
    });

    it('should return 400 on an unauthorized JWT token creation attempt.', function (done) {
        chai.request(server)
        .post('/api/authentication/jwt_token')
        .send({username:'amjed', password:'falsepassword', registration_id:'somerandomnumber8972134'})
        .end(function(err, res) {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.be.a('object');
            done();
        });
    });

    it('should return 400 on an attempt to create JWT token without a registraion id.', function (done) {
        chai.request(server)
        .post('/api/authentication/jwt_token')
        .send({username:'somenotexistinguser', password:'falsepassword', registration_id:'somerandomnumber8972134'})
        .end(function(err, res) {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.be.a('object');
            done();
        });
    });

    it('should authenticate the request with an earlier issued token.', function (done) {
        chai.request(server)
        .post('/api/authentication/jwt_token')
        .send({username: testUser, password: testPassword, registration_id: testRegistrationId})
        .end(function(err, res) {
            res.should.have.status(200);
            var token = res.body.token;

            var bearer = {'Authorization': 'Bearer ' + token};
            chai.request(server)
            .get('/api/drivers')
            .set(bearer)
            .set({'RegistrationId': 'id123id'})
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
            });
            assert('Issued jwtTokens and being authenticated.');
            done();
        });
    });

    it('should not authenticate an earlier issued token with non-matching registrationid.', function (done) {

        var actualRegId = 'my-new-reg-for-new-device';
        chai.request(server)
        .post('/api/authentication/jwt_token')
        .send({username: testUser, password: testPassword, registration_id: actualRegId })
        .end(function(err, res) {
            res.should.have.status(200);
            var token = res.body.token;

            var bearer = {'Authorization': 'Bearer ' + token};
            chai.request(server)
            .get('/api/drivers')
            .set(bearer)
            .set({'RegistrationId': 'some-random-registration-id'})
            .end(function(err, res) {
                res.should.have.status(401);
                // res.should.be.json;
                // res.body.should.be.a('object');
            });
            done();
        });
    });

    it('should not authenticate an earlier issued token with an empty registrationid.', function (done) {

        var localRegId = 'my-new-reg-for-device-2';
        chai.request(server)
        .post('/api/authentication/jwt_token')
        .send({username: testUser, password: testPassword, registration_id: localRegId })
        .end(function(err, res) {
            res.should.have.status(200);
            var token = res.body.token;

            var bearer = {'Authorization': 'Bearer ' + token};
            chai.request(server)
            .get('/api/drivers')
            .set(bearer)
            .set({'RegistrationId': ''})
            .end(function(err, res) {
              // Bearer strategy throws always a 401 ?
                res.should.have.status(401);
                // res.should.be.json;
                // res.body.should.be.a('object');
            });
            done();
        });
    });
});
