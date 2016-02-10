
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var should = chai.should();

var authHeader = '';
var authUser = 'amjed';
var authPass = 'amjed';

chai.use(chaiHttp);

describe('Users', function() {



  before(function(done) {
    chai.request(server)
    .post('/api/authentication/jwt_token')
    .send({username: authUser, password: authPass, registration_id: 'id123id'})
    .end(function(err, res) {
        res.should.have.status(200);
        authHeader = {'Authorization': 'Bearer '+ res.body.token};
        done();
    });
  });

  it('should list All users on /users GET', function (done) {
      chai.request(server)
      .get('/api/users')
      .set(authHeader)
      .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          done();
      });
  });

  it('should list a SINGLE user on /user/<id> GET');
  it('should add a SINGLE user on /users/ POST');
  it('should update a SINGLE user on /user/<id> PUT');
  it('should delete a SINGLE user on /user/<id> DELETE');
});
