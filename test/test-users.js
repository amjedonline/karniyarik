
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var should = chai.should();
var assert = chai.assert;
var async = require('async');

var authHeader = '';
var registrationHeader = '';

var authUser = 'userForUsersSuite@yahoo.com';
var authPass = 'userForUsersSuitePassword';
var registrationId = 'regid-for-userForUsersSuite';

chai.use(chaiHttp);

describe('Users', function() {

  before(function(done) {

    var createTestUser = function(callback) {
      chai.request(server)
        .post('/api/users')
        .send({email: authUser, password: authPass})
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
      .send({email: authUser, password: authPass, registration_id: registrationId})
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
    .send({email: 'superman@heroes.us', password: 'superSecret123'})
    .end(function(err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object')
        done();
    });
  });

  it('should return 400 on an attempt to create an email with an invalid email address on /users/ POST', function (done){
    chai.request(server)
    .post('/api/users')
    .set(authHeader)
    .set(registrationHeader)
    .send({email: 'superman', password: 'superSecret123'})
    .end(function(err, res) {
        res.should.have.status(400);
        res.body.should.be.a('object')
        done();
    });
  });

  it('should return 400 on an attempt to create an email with a duplicate email address on /users/ POST', function (done){

    var createFirst = function (cb){
      chai.request(server)
        .post('/api/users')
        .set(authHeader)
        .set(registrationHeader)
        .send({email: 'bob@foo.com', password: 'superSecret123'})
        .end(function(err, res) {
            if(err){
              cb(err);
            } else{
              res.should.have.status(200);
              res.body.should.be.a('object')
              cb();
            }
        });
    }

    var createDuplicate = function (cb){
      chai.request(server)
        .post('/api/users')
        .set(authHeader)
        .set(registrationHeader)
        .send({email: 'bob@foo.com', password: 'bobbylovescoffee'})
        .end(function(err, res) {
            res.should.have.status(400);
            res.body.should.be.a('object')
            if(err){
              cb(err);
            } else {
              cb();
            }
        });
    }

    async.series( [createFirst, createDuplicate], function(err) {
      if (!err){
        assert.fail('Failed to Test Duplicate user email address prevention case.');
      }
      done();
    });

  });

  it('should update a SINGLE user on /user/<id> PUT');
  it('should delete a SINGLE user on /user/<id> DELETE');
});
