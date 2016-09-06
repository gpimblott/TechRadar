var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

var webUsers = require('../../../handlers/web/usersWebHandler.js');

describe("Users web handler", function() {
    var req, res;

    beforeEach(function() {
        req = res = {};
        res.render = sinon.spy();
    });

    describe("listUsers", function() {
        it("should render list users page", function() {
            webUsers.list(req, res);

            sinon.assert.calledOnce(res.render);
            expect(res.render.args[0][0]).that.is.a('string').to.contain('listUsers');
        });
    });

    describe("addUser", function() {
        it("should render add user page", function() {
            webUsers.add(req, res);
            
            sinon.assert.calledOnce(res.render);
            expect(res.render.args[0][0]).that.is.a('string').to.contain('addUser');
        });
    });

    describe("editProfile", function() {
        it("should render edit profile page", function() {
            webUsers.editProfile(req, res);
            
            sinon.assert.calledOnce(res.render);
            expect(res.render.args[0][0]).that.is.a('string').to.contain('editProfile');
        });
    });
});
