
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var should = chai.should();
var assert = chai.assert;
var async = require('async');

var authHeader = '';
var registrationHeader = '';

var authUser = 'userForUsersSuite';
var authPass = 'userForUsersSuitePassword';
var registrationId = 'regid-for-userForUsersSuite';

chai.use(chaiHttp);

describe('Users', function() {

  before(function(done) {

    var createTestUser = function(callback) {
      chai.request(server)
        .post('/api/users')
        .send({username: authUser, password: authPass})
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.be.a('object')
            assert.ok('Created test user.')
            callback();
        });
    };

    var createAccessToken = function (callback) {
      chai.request(server)
      .post('/api/authentication/jwt_token')
      .send({username: authUser, password: authPass, registration_id: registrationId})
      .end(function(err, res) {
          res.should.have.status(200);
          authHeader = {'Authorization': 'Bearer '+ res.body.token};
          registrationHeader = {'RegistrationId': registrationId};
          callback();
      });
    };

    async.series( [ createTestUser, createAccessToken], function(err) {
      if (err)
        assert.fail('Failed to create Test fixtures for Drivers test suite.');
      done();
    });

  });

  it('should list All users on /users GET', function (done) {
      chai.request(server)
      .get('/api/users')
      .set(authHeader)
      .set(registrationHeader)
      .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          done();
      });
  });

  it('should list a SINGLE user on /user/<id> GET');

  it('should add a SINGLE user on /users/ POST', function (done){
    chai.request(server)
    .post('/api/users')
    .set(authHeader)
    .set(registrationHeader)
    .send({username: 'superman', password: 'superSecret123'})
    .end(function(err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object')
        done();
    });

  });
  it('should update a SINGLE user on /user/<id> PUT');
  it('should delete a SINGLE user on /user/<id> DELETE');
});
