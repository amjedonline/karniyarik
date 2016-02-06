
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var should = chai.should();
var util = require('util');

chai.use(chaiHttp);

var testDriver = {
  userId: "userid-123",
  fname: "Max",
  lname: "Rosemann",
  email: "max.rosemann@gmail.com",
  gender: "Male",
  dob: "06/02/1986",
  mobile: "1234567890",
  licensenumber: "license-123",
  licenseexpirydate: "21/10/2017",
  insurancenumber: "insurance-123",
  insuranceexpirydate: "21/11/2017",
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

describe('Drivers', function() {

    before(function(){
      // create test data before
      chai.request(server)
      .post('/api/drivers')
      .auth(authUser, authPass)
      .send(testDriver)
      .then(function (res) {
          testDriverId = res.body._id;
          console.log('Created test driver id: ' + testDriverId);
      });

    });
    it('should list All drivers on /api/drivers GET', function (done) {
        chai.request(server)
        .get('/api/drivers')
        .auth(authUser, authPass)
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
        .auth(authUser, authPass)
        .end(function (err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            console.log(util.inspect(res.body));
            done();
        });
    });

    it('should add a SINGLE user on /api/drivers/ POST');
    it('should update a SINGLE user on /api/drivers/<id> PUT');
    it('should delete a SINGLE user on /api/drivers/<id> DELETE');
});
