
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var should = chai.should();
var assert = chai.assert;
var util = require('util');
var diff = require('deep-diff').diff;

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
var authUser = "amjed";
var authPass = "amjed";
var authHeader = '';

describe('Drivers', function() {

    before(function(done) {
      chai.request(server)
      .post('/api/authentication/jwt_token')
      .send({username: authUser, password: authPass, registration_id: 'id123id'})
      .end(function(err, res) {
          res.should.have.status(200);
          authHeader = {'Authorization': 'Bearer '+ res.body.token};
          // create test data before
          chai.request(server)
          .post('/api/drivers')
          .set(authHeader)
          .send(testDriver)
          .end(function (err, res) {
            testDriverId = res.body._id;
            done();
          });
      });
    });

    it('should list All drivers on /api/drivers GET', function (done) {
        chai.request(server)
        .get('/api/drivers')
        .set(authHeader)
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
        .end(function (err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');

            var isMatch = _.isMatch(res.body, testDriver);
            assert.isTrue(isMatch, "The created object has all the properties requested in post.");
            done();
        });
    });

    it('should add a SINGLE user on /api/drivers/ POST');
    it('should update a SINGLE user on /api/drivers/<id> PUT');
    it('should delete a SINGLE user on /api/drivers/<id> DELETE');
});
