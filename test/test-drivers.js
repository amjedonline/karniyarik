
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

var testDriver = {
  fname: "Max",
  lname: "Rosemann",
  email: "max.rosemann@gmail.com",
  gender: "Male",
  dob: "1986-02-06T00:00:00.000Z",
  mobile: "1234567890",
  licensenumber: "license-123",
  licenseexpirydate: "2019-02-07T00:00:00.000Z",
  insurancenumber: "insurance-123",
  insuranceexpirydate: "2017-01-20T00:00:00.000Z",
  country: "Turkey",
  state: "Ankara",
  city: "Ankara",
  addressline1: "Address-1",
  addressline2: "Address-2",
  postal: "123456"
}

var testDriverId = "";
var authUser = "driverTestingUser";
var authPass = "driverTestingUserPassword";
var registrationId = 'driverTestingUserRegistration1';
var authHeader = '';
var registrationHeader = '';

describe('Drivers', function() {

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

      var createTestDriver = function(callback) {
        // create test data before
        chai.request(server)
        .post('/api/drivers')
        .set(authHeader)
        .set(registrationHeader)
        .send(testDriver)
        .end(function (err, res) {
          testDriverId = res.body._id;
          assert.ok('Created a test driver.')
          callback();
        });
      };

      async.series( [ createTestUser, createAccessToken, createTestDriver ], function(err) {
        if (err)
          assert.fail('Failed to create Test fixtures for Drivers test suite.');
        done();
      });
    });

    it('should list All drivers on /api/drivers GET', function (done) {
        chai.request(server)
        .get('/api/drivers')
        .set(authHeader)
        .set(registrationHeader)
        .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            done();
        });
    });

    it('should list a SINGLE driver on /api/drivers/<id> GET', function(done) {
        chai.request(server)
        .get('/api/drivers/'+testDriverId)
        .set(authHeader)
        .set(registrationHeader)
        .end(function (err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');

            var isMatch = _.isMatch(res.body, testDriver);
            assert.isTrue(isMatch, "The created object has all the properties requested in post.");
            done();
        });
    });

    it('should update a SINGLE driver on /api/drivers/<id> PUT', function (done){
      var newValue = {
        fname: "Mathias",
        lname: "Klatsch",
        email: "mathias.klatsch@gmail.com",
        gender: "Male",
        dob: "1987-06-07T00:00:00.000Z",
        mobile: "23142",
        licensenumber: "license-xyz",
        licenseexpirydate: "2020-02-07T00:00:00.000Z",
        insurancenumber: "insurance-987",
        insuranceexpirydate: "2018-01-20T00:00:00.000Z",
        country: "Germany",
        state: "Nordrhein Westfallen",
        city: "Duesseldorf",
        addressline1: "Housenummer 42",
        addressline2: "Tamaradanz Strasse",
        postal: "10178"
      }
      chai.request(server)
      .put('/api/drivers/' + testDriverId)
      .set(authHeader)
      .set(registrationHeader)
      .send(newValue)
      .end(function(err, res) {
          res.should.have.status(200);
          chai.request(server)
          .get('/api/drivers/' + testDriverId)
          .set(authHeader)
          .set(registrationHeader)
          .end(function (err, res) {
            res.should.have.status(200);
            assert.isTrue(_.isMatch(res.body, newValue));
            assert.ok('Put on /drivers/driverId updates the Driver.');
          });
          done();
      });
    });

    it('should delete a SINGLE driver on /api/drivers/<id> DELETE', function (done){
      chai.request(server)
      .delete('/api/drivers/' + testDriverId)
      .set(authHeader)
      .set(registrationHeader)
      .end(function (err, res) {
        res.should.have.status(200);
        chai.request(server)
        .get('/api/drivers/' + testDriverId)
        .set(authHeader)
        .set(registrationHeader)
        .end(function (err, res) {
          res.should.have.status(404);
          assert.ok('Delete on /drivers/driverId deletes the Driver.');
        });
      });
      done();
    });

    it('should return 404 on an attempt to delete a NON-EXISTING driver on /api/drivers/<id> DELETE', function (done){
      chai.request(server)
      .delete('/api/drivers/' + '56bfbacc0ce9661d09fe9b4a')
      .set(authHeader)
      .set(registrationHeader)
      .end(function (err, res) {
        res.should.have.status(404);
      });
      done();
    });
});
