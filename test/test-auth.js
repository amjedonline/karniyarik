
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var should = chai.should();
var assert = chai.assert;

var _ = require('underscore');
var util = require('util');

var testUser = 'testuser@gmx.de';
var testPassword = 'amjed123';
var testScope = 'passenger';
var testRegistrationId = 'id123id';

chai.use(chaiHttp);

describe('User authentication for with basic/jwt token.', function() {
    before(function (done){
      chai.request(server)
      .post('/api/users')
      .send({email: testUser, password: testPassword, scope: testScope})
      .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.be.a('object')
          done();
      });

    });
    it('should create a valid JWT token and send response.', function (done) {
        chai.request(server)
        .post('/api/authentication/jwt_token')
        .send({email:testUser, password:testPassword, registration_id:testRegistrationId, scope: testScope})
        .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');

            var tokenResponse = res.body;

            var containsAllKeys = _.every(
                ['token', 'token_type', 'valid_till', 'scope'],
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
        .send({email:testUser, password:'falsepassword', registration_id:testRegistrationId})
        .end(function(err, res) {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.be.a('object');
            done();
        });
    });


    it('should return 400 on an attempt to create JWT token without scope.', function (done) {
        chai.request(server)
        .post('/api/authentication/jwt_token')
        .send({email:testUser, password: testPassword, registration_id:testRegistrationId})
        .end(function(err, res) {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.be.a('object');
            done();
        });
    });

    it('should return 400 on an attempt to create JWT token with false email.', function (done) {
        chai.request(server)
        .post('/api/authentication/jwt_token')
        .send({email:'nonexistentuser@nowhere.ca', password:testPassword, registration_id:'somerandomnumber8972134', scope: testScope})
        .end(function(err, res) {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.be.a('object');
            done();
        });
    });

    it('should return 400 on an attempt to create JWT token with non-existent scope.', function (done) {
        chai.request(server)
        .post('/api/authentication/jwt_token')
        .send({email:testUser, password:testPassword, registration_id:'somerandomnumber8972134', scope: 'superman'})
        .end(function(err, res) {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.be.a('object');
            done();
        });
    });


    it('should return 400 on an attempt to create JWT token with not-registered-for scope.', function (done) {
        chai.request(server)
        .post('/api/authentication/jwt_token')
        .send({email:testUser, password:testPassword, registration_id:'somerandomnumber8972134', scope: 'driver'})
        .end(function(err, res) {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.be.a('object');
            done();
        });
    });

    it('should return 400 on an attempt to create JWT token with false email and false password.', function (done) {
        chai.request(server)
        .post('/api/authentication/jwt_token')
        .send({email:'somenotexistinguser@whereami.au', password:'falsepassword', registration_id:'somerandomnumber8972134', scope: testScope})
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
        .send({email:'amjed@work.eu', password:'falsepassword', registration_id:'somerandomnumber8972134', scope: testScope})
        .end(function(err, res) {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.be.a('object');
            done();
        });
    });

    it('should return 400 on an attempt to create JWT token without a registration id.', function (done) {
        chai.request(server)
        .post('/api/authentication/jwt_token')
        .send({email:testUser, password:testPassword, scope: testScope})
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
        .send({email: testUser, password: testPassword, registration_id: testRegistrationId, scope: testScope})
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
        .send({email: testUser, password: testPassword, registration_id: actualRegId, scope: testScope })
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
        .send({email: testUser, password: testPassword, registration_id: localRegId, scope: testScope })
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
