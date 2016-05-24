var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

var cache = require('../../../dao/cache.js');
var category = require('../../../dao/category.js');
var apiutils = require('../../../handlers/api/apiUtils.js');

var apiCategories = require('../../../handlers/api/categoriesApiHandler.js');


describe("Categories handler", function() {
    var req, res;

    beforeEach(function() {
        req = res = {};
        res.end = sinon.spy();
        res.writeHead = sinon.spy();
    });

    describe("getCategories", function() {
        var getAllSpy, testData = {foo: "bar"};

        beforeEach(function() {
            getAllSpy = sinon.stub(category, 'getAll', function(cb) {
                cb(testData);
            });
        });

        afterEach(function() {
            category.getAll.restore();
        });

        it("should call category dao", function() {
            apiCategories.getCategories(req, res);

            sinon.assert.calledOnce(category.getAll);
        });

        it("should generate a response with stringified data", function() {
            apiCategories.getCategories(req, res);

            sinon.assert.calledOnce(res.end);
            sinon.assert.calledOnce(res.writeHead);
            expect(res.end.getCalls()[0].args[0]).that.is.an('string').to.equal(JSON.stringify(testData));
        });
    });

    describe("addCategory", function() {
        var addCategorySpy,
            testData = true,
            app = {},
            apiUtilsSpy,
            cacheSpy;

        beforeEach(function() {
            req.body = {name: "test name", description: "test description"};

            addCategorySpy = sinon.stub(category, 'add', function(name, description, cb) {
                cb(testData);
            });
            apiUtilsSpy = sinon.stub(apiutils, 'handleResultSet', function(res, result, error) {
            });
            cacheSpy = sinon.stub(cache, 'refresh', function(app) {
            });

        });

        afterEach(function() {
            category.add.restore();
            apiutils.handleResultSet.restore();
            cache.refresh.restore();
        });

        it("should call category dao with proper data", function() {
            apiCategories.addCategory(app)(req, res);

            sinon.assert.calledOnce(category.add);
            expect(addCategorySpy.getCalls()[0].args[0]).that.is.an('string').to.equal(req.body.name);
            expect(addCategorySpy.getCalls()[0].args[1]).that.is.an('string').to.equal(req.body.description);
        });

        it("should generate response based on dao results", function() {
            apiCategories.addCategory(app)(req, res);

            sinon.assert.calledOnce(apiutils.handleResultSet);
            expect(apiUtilsSpy.getCalls()[0].args[1]).that.is.an('boolean').to.equal(testData);
        });

        it("should refresh cache on success", function() {
            apiCategories.addCategory(app)(req, res);

            sinon.assert.calledOnce(cache.refresh);
        });

        it("should not refresh cache on failure", function() {
            testData = false;
            apiCategories.addCategory(app)(req, res);

            sinon.assert.notCalled(cache.refresh);
        });
    });

    describe("deleteCategories", function() {
        var deleteCategorySpy,
            testData = true,
            app = {},
            apiUtilsSpy,
            cacheSpy;

        beforeEach(function() {
            req.body = {id: 1};

            deleteCategorySpy = sinon.stub(category, 'delete', function(data, cb) {
                cb(testData);
            });
            apiUtilsSpy = sinon.stub(apiutils, 'handleResultSet', function(res, result, error) {
            });
            cacheSpy = sinon.stub(cache, 'refresh', function(app) {
            });

        });

        afterEach(function() {
            category.delete.restore();
            apiutils.handleResultSet.restore();
            cache.refresh.restore();
        });

        it("should call category dao with proper data", function() {
            apiCategories.deleteCategories(app)(req, res);

            sinon.assert.calledOnce(category.delete);
            expect(deleteCategorySpy.getCalls()[0].args[0]).that.is.an('number').to.equal(req.body.id);
        });

        it("should generate response based on dao results", function() {
            apiCategories.deleteCategories(app)(req, res);

            sinon.assert.calledOnce(apiutils.handleResultSet);
            expect(apiUtilsSpy.getCalls()[0].args[1]).that.is.a('boolean').to.equal(testData);
        });

        it("should refresh cache on success", function() {
            apiCategories.deleteCategories(app)(req, res);

            sinon.assert.calledOnce(cache.refresh);
        });

        it("should not refresh cache on failure", function() {
            testData = false;
            apiCategories.deleteCategories(app)(req, res);

            sinon.assert.notCalled(cache.refresh);
        });
    });
});
