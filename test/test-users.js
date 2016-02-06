
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var should = chai.should();

chai.use(chaiHttp);

describe('Users', function() {
    it('should list All users on /users GET', function (done) {
        chai.request(server)
        .get('/api/users')
        .auth('amjed', 'amjed')
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
