
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

var testTaxi = {
  number: "IS 12345",
  manufacturer: "Audi",
  model: "TT",
  bodyStyle: "Coupe",
  power: 180,
  colour: "Black",
  capacity: 2,
  maximumLuggage: 500,
  motorExpiry: "2031-02-06T00:00:00.000Z",
  insuranceNumber: "Insure-123",
  insuranceExpiryDate: "2021-11-13T00:00:00.000Z",
  pcoLicenseExpiryDate: "2025-01-30T00:00:00.000Z",
  status: "Online"
}

var testTaxiId = "";
var authUser = "taxiTestingUser1@alotaksim.tr";
var authPass = "taxiTestingPassword1";
var registrationId = 'taxiTestingUserRegistration1';
var authHeader = '';
var registrationHeader = '';


describe('Taxis', function() {

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
          authHeader = { 'Authorization': 'Bearer '+ res.body.token };
          registrationHeader = { 'RegistrationId': registrationId };
          assert.ok('Created authentication token.')
          callback();
      });
    };

    var createTestTaxi = function(callback) {
      // create test data before
      chai.request(server)
      .post('/api/taxis')
      .set(authHeader)
      .set(registrationHeader)
      .send(testTaxi)
      .end(function (err, res) {
        res.should.have.status(200);
        res.should.be.json;
        testTaxiId = res.body._id;
        assert.ok('Created a test Taxi.')
        //console.log('Created taxi ' + util.inspect(res));
        callback();
      });
    };

    async.series( [ createTestUser, createAccessToken, createTestTaxi ], function(err) {
      if (err)
        assert.fail('Failed to create Test fixtures for Taxis test suite.');
      done();
    });
  });

    it('should list All Taxis on /api/taxis GET', function (done) {
        chai.request(server)
        .get('/api/taxis')
        .set(authHeader)
        .set(registrationHeader)
        .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            done();
        });
    });


    it('should list a SINGLE taxi on /api/taxis/<id> GET', function(done) {
        chai.request(server)
        .get('/api/taxis/'+testTaxiId)
        .set(authHeader)
        .set(registrationHeader)
        .end(function (err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');

            var isMatch = _.isMatch(res.body, testTaxi);
            // console.log('Comparing ' + util.inspect(diff(res.body, testTaxi)));
            assert.isTrue(isMatch, "The created Taxi has all the properties requested in post.");
            done();
        });
    });

    it('should return 400 on unauthorized attempt to get a taxi on /api/taxis/<id> GET', function(done) {
        chai.request(server)
        .get('/api/taxis/'+testTaxiId)
        .set(registrationHeader)
        .end(function (err, res) {
            res.should.have.status(401);
            done();
        });
    });

    it('should return 404 on attempt to get a NON-EXISTING taxi on /api/taxis/<id> GET', function(done) {
        chai.request(server)
        .get('/api/taxis/'+'35acbadd0ce9321d51ba7e9c')
        .set(authHeader)
        .set(registrationHeader)
        .end(function (err, res) {
            res.should.have.status(404);
            done();
        });
    });

    /**
    Test cases for search Taxi
    **/
    it('should list a SINGLE taxi on /api/taxis/searches/byNumber/<number> GET', function(done) {
        chai.request(server)
        .get('/api/taxis/searches/byNumber/'+testTaxi.number)
        .set(authHeader)
        .set(registrationHeader)
        .end(function (err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');

            var isMatch = _.isMatch(res.body[0], testTaxi);
            // console.log('Comparing ' + util.inspect(diff(res.body, testTaxi)));
            assert.isTrue(isMatch, "Created test taxi found using searchTaxi endpoint.");
            done();
        });
    });

    it('should return 400 on unauthorized attempt to get a taxi on /api/taxis/searches/byNumber/<number> GET', function(done) {
        chai.request(server)
        .get('/api/taxis/searches/byNumber/'+testTaxiId)
        .set(registrationHeader)
        .end(function (err, res) {
            res.should.have.status(401);
            res.body.should.be.a('object');
            done();
        });
    });

    it('should return 200 with an empty JSON object Array if no taxi was found on /api/taxis/searches/byNumber/<number> GET', function(done) {
        chai.request(server)
        .get('/api/taxis/searches/byNumber/'+'IZ 7373')
        .set(authHeader)
        .set(registrationHeader)
        .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.be.a('array');
            // test for empty array
            assert.isTrue(res.body.length == 0);
            done();
        });
    });

/** Test cases for PUT **/

    it('should update a SINGLE taxi on /api/taxis/<id> PUT', function (done){
      var newValue = {
        number: "AK 73829",
        manufacturer: "Mercedes",
        model: "Z90",
        bodyStyle: "Sedan",
        power: "250",
        colour: "White",
        capacity: "5",
        maximumLuggage: "1500",
        motorExpiry: "2025-02-06T00:00:00.000Z",
        insuranceNumber: "xyz-Insure-123",
        insuranceExpiryDate: "2027-11-13T00:00:00.000Z",
        pcoInsuranceNumber: "567-Pco-Insure-123",
        pcoLicenseExpiryDate: "2020-01-30T00:00:00.000Z",
        status: "Offline"
      }

      chai.request(server)
      .put('/api/taxis/' + testTaxiId)
      .set(authHeader)
      .set(registrationHeader)
      .send(newValue)
      .end(function(err, res) {
          res.should.have.status(200);
          chai.request(server)
          .get('/api/taxis/' + testTaxiId)
          .set(authHeader)
          .set(registrationHeader)
          .end(function (err, res) {
            res.should.have.status(200);
            assert.isTrue(_.isMatch(res.body, newValue));
            assert.ok('Put on /taxis/taxiId updates the Taxi.');
          });
          done();
      });
    });

    it('should return 401 an unauthorized attempt to PUT/Updated a taxi on /api/taxis/<id> PUT', function (done){
      var newValue = {
        insuranceNumber: "xyz-Insure-123",
        insuranceExpiryDate: "2027-11-13T00:00:00.000Z",
        pcoInsuranceNumber: "567-Pco-Insure-123"
      }
      chai.request(server)
      .put('/api/taxis/' + testTaxiId)
      .set(registrationHeader)
      .send(newValue)
      .end(function(err, res) {
          res.should.have.status(401);
          done();
      });
    });

    it('should return 404 an attempt to PUT/Updated a NON-EXISTING taxi on /api/taxis/<id> PUT', function (done){
      var newValue = {
        insuranceNumber: "xyz-Insure-123",
        insuranceExpiryDate: "2027-11-13T00:00:00.000Z",
        pcoInsuranceNumber: "567-Pco-Insure-123"
      }
      chai.request(server)
      .put('/api/taxis/' + '35acbadd0ce9321d51ba7e9c')
      .set(authHeader)
      .set(registrationHeader)
      .send(newValue)
      .end(function(err, res) {
          res.should.have.status(404);
          done();
      });
    });

    it('should delete a SINGLE taxi on /api/taxis/<id> DELETE', function (done){
      chai.request(server)
      .delete('/api/taxis/' + testTaxiId)
      .set(authHeader)
      .set(registrationHeader)
      .end(function (err, res) {
        res.should.have.status(200);
        chai.request(server)
        .get('/api/taxis/' + testTaxiId)
        .set(authHeader)
        .set(registrationHeader)
        .end(function (err, res) {
          res.should.have.status(404);
          assert.ok('Delete on /taxis/taxiId deletes the Taxi.');
        });
      });
      done();
    });

    it('should return 404 on an attempt to delete a NON-EXISTING taxi on /api/taxis/<id> DELETE', function (done){
      chai.request(server)
      .delete('/api/taxis/' + '35acbadd0ce9321d51ba7e9c')
      .set(authHeader)
      .set(registrationHeader)
      .end(function (err, res) {
        res.should.have.status(404);
      });
      done();
    });

});
