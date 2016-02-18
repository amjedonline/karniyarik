
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var should = chai.should();
var assert = chai.assert;
var util = require('util');
var diff = require('deep-diff').diff;

var async = require('async');

var _ = require('underscore');

chai.use(chaiHttp);

var testPassenger = {
  fname: "Alice",
  lname: "Cayenne",
  email: "alice.cayenne@gmail.com",
  gender: "Female",
  dob: "1991-02-06T00:00:00.000Z",
  mobile: "1234567890",
  country: "US",
  state: "Washington",
  city: "Seattle",
  addressline1: "Housenummer 3",
  addressline2: "Gates Avenue",
  postal: "W-1456"
}

var testPassengerId = "";
var authUser = "passengerTestingUser1";
var authPass = "passengerTestingPassword1";
var registrationId = 'passengerTestingUserRegistration1';
var authHeader = '';
var registrationHeader = '';


describe('Passengers', function() {


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
          authHeader = { 'Authorization': 'Bearer '+ res.body.token };
          registrationHeader = { 'RegistrationId': registrationId };
          assert.ok('Created authentication token.')
          callback();
      });
    };

    var createTestPassenger = function(callback) {
      // create test data before
      chai.request(server)
      .post('/api/passengers')
      .set(authHeader)
      .set(registrationHeader)
      .send(testPassenger)
      .end(function (err, res) {
        testPassengerId = res.body._id;
        assert.ok('Created a test Passenger.')
        callback();
      });
    };

    async.series( [ createTestUser, createAccessToken, createTestPassenger ], function(err) {
      if (err)
        assert.fail('Failed to create Test fixtures for Drivers test suite.');
      done();
    });
  });

    it('should list All Passengers on /api/passengers GET', function (done) {
        chai.request(server)
        .get('/api/passengers')
        .set(authHeader)
        .set(registrationHeader)
        .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            done();
        });
    });

});
