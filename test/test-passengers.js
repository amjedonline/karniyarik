
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
var authUser = "passengerTestingUser1@alotaksim.tr";
var authPass = "passengerTestingPassword1";
var authScope = "passenger";
var registrationId = 'passengerTestingUserRegistration1';
var authHeader = '';
var registrationHeader = '';


describe('Passengers', function() {


  before(function(done) {

    var createTestUser = function(callback) {
      chai.request(server)
        .post('/api/users')
        .send({email: authUser, password: authPass, scope: authScope})
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
      .send({email: authUser, password: authPass, registration_id: registrationId, scope: authScope})
      .end(function(err, res) {
          res.should.have.status(200);
          authHeader = { 'Authorization': 'Bearer '+ res.body.token };
          registrationHeader = { 'RegistrationId': registrationId };
          assert.ok('Created authentication token.')
          callback();
      });
    };

    var getPassengerIdForUser = function(callback) {
      chai.request(server)
      .get('/api/passengers/forUser')
      .set(authHeader)
      .set(registrationHeader)
      .end(function (err, res) {
        res.should.have.status(200);
        testPassengerId = res.body._id;
        assert.ok('Got the test passenger.');
        callback(null);
      });
    };

    var putTestPassengerProfile = function(callback) {
      chai.request(server)
      .put('/api/passengers/'+testPassengerId)
      .set(authHeader)
      .set(registrationHeader)
      .send(testPassenger)
      .end(function (err, res) {
        res.should.have.status(200);
        assert.ok('Updated the test passenger profile.')
        callback(null);
      });
    };

    async.series( [ createTestUser, createAccessToken, getPassengerIdForUser, putTestPassengerProfile ], function(err) {
      if (err)
        assert.fail('Failed to create Test fixtures for Passengers test suite.');
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


    it('should list a SINGLE passenger on /api/passengers/<id> GET', function(done) {
        chai.request(server)
        .get('/api/passengers/'+testPassengerId)
        .set(authHeader)
        .set(registrationHeader)
        .end(function (err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');

            var isMatch = _.isMatch(res.body, testPassenger);
            assert.isTrue(isMatch, "The created Passenger has all the properties requested in post.");
            done();
        });
    });

    it('should return 400 on unauthorized attempt to get a passenger on /api/passengers/<id> GET', function(done) {
        chai.request(server)
        .get('/api/passengers/'+testPassengerId)
        .set(registrationHeader)
        .end(function (err, res) {
            res.should.have.status(401);
            done();
        });
    });

    it('should return 404 on attempt to get a NON-EXISTING passenger on /api/passengers/<id> GET', function(done) {
        chai.request(server)
        .get('/api/passengers/'+'35acbadd0ce9321d51ba7e9c')
        .set(authHeader)
        .set(registrationHeader)
        .end(function (err, res) {
            res.should.have.status(404);
            done();
        });
    });


    it('should update a SINGLE passenger on /api/passengers/<id> PUT', function (done){
      var newValue = {
        fname: "Til",
        lname: "Schweiger",
        gender: "Male",
        dob: "1967-10-11T00:00:00.000Z",
        mobile: "982374908",
        country: "Germany",
        state: "Nordrhein Westfallen",
        city: "Duesseldorf",
        addressline1: "Housenummer 42",
        addressline2: "Tamaradanz Strasse",
        postal: "10178"
      }
      chai.request(server)
      .put('/api/passengers/' + testPassengerId)
      .set(authHeader)
      .set(registrationHeader)
      .send(newValue)
      .end(function(err, res) {
          res.should.have.status(200);
          chai.request(server)
          .get('/api/passengers/' + testPassengerId)
          .set(authHeader)
          .set(registrationHeader)
          .end(function (err, res) {
            res.should.have.status(200);
            assert.isTrue(_.isMatch(res.body, newValue));
            assert.ok('Put on /passengers/passengerId updates the Passenger.');
          });
          done();
      });
    });

    it('should return 401 an unauthorized attempt to PUT/Updated a passenger on /api/passengers/<id> PUT', function (done){
      var newValue = {
        fname: "Dr",
        lname: "Evil"
      }
      chai.request(server)
      .put('/api/passengers/' + testPassengerId)
      .set(registrationHeader)
      .send(newValue)
      .end(function(err, res) {
          res.should.have.status(401);
          done();
      });
    });

    it('should return 404 an attempt to PUT/Updated a NON-EXISTING passenger on /api/passengers/<id> PUT', function (done){
      var newValue = {
        fname: "Dr",
        lname: "Evil"
      }
      chai.request(server)
      .put('/api/passengers/' + '35acbadd0ce9321d51ba7e9c')
      .set(authHeader)
      .set(registrationHeader)
      .send(newValue)
      .end(function(err, res) {
          res.should.have.status(404);
          done();
      });
    });

    it('should delete a SINGLE passenger on /api/passengers/<id> DELETE', function (done){
      chai.request(server)
      .delete('/api/passengers/' + testPassengerId)
      .set(authHeader)
      .set(registrationHeader)
      .end(function (err, res) {
        res.should.have.status(200);
        chai.request(server)
        .get('/api/passengers/' + testPassengerId)
        .set(authHeader)
        .set(registrationHeader)
        .end(function (err, res) {
          res.should.have.status(404);
          assert.ok('Delete on /passengers/passengerId deletes the Passenger.');
        });
      });
      done();
    });

    it('should return 404 on an attempt to delete a NON-EXISTING passenger on /api/passengers/<id> DELETE', function (done){
      chai.request(server)
      .delete('/api/passengers/' + '35acbadd0ce9321d51ba7e9c')
      .set(authHeader)
      .set(registrationHeader)
      .end(function (err, res) {
        res.should.have.status(404);
      });
      done();
    });

});
