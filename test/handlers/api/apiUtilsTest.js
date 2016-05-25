var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

var cache = require('../../../dao/cache.js');
var category = require('../../../dao/category.js');
var technology = require('../../../dao/technology.js');

var apiUtils = require('../../../handlers/api/apiUtils.js');


describe("apiUtils", function() {
    describe("handleResultSet", function() {
        var res, result, error;

        beforeEach(function() {
            result = res = error = {};
            res.end = sinon.spy();
            res.writeHead = sinon.spy();

            result = "test result";
        });

        it("should respond with success true when result present", function() {
            apiUtils.handleResultSet(res, result, error);

            sinon.assert.calledOnce(res.writeHead);
            sinon.assert.calledOnce(res.end);
            expect(res.end.args[0][0]).to.be.a('string');
            expect(JSON.parse(res.end.args[0][0])).to.be.an('object');
            expect(JSON.parse(res.end.args[0][0])).to.have.a.property("result", result);
            expect(JSON.parse(res.end.args[0][0])).to.have.a.property("success", true);
        });

        it("should respond with success false when no result", function() {
            result = null;
            error = "test error";

            apiUtils.handleResultSet(res, result, error);

            sinon.assert.calledOnce(res.writeHead);
            sinon.assert.calledOnce(res.end);
            expect(res.end.args[0][0]).to.be.a('string');
            expect(JSON.parse(res.end.args[0][0])).to.be.an('object');
            expect(JSON.parse(res.end.args[0][0])).to.have.a.property("error", error);
            expect(JSON.parse(res.end.args[0][0])).to.have.a.property("success", false);
        });
    });
});
