var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

var cache = require('../../../dao/cache.js');
var category = require('../../../dao/category.js');
var technology = require('../../../dao/technology.js');

var webCategories = require('../../../handlers/web/categoriesWebHandler.js');


describe("Categories web handler", function() {
    var req, res;

    beforeEach(function() {
        req = res = {};
        res.render = sinon.spy();
    });

    describe("listCategories", function() {
        it("should render list categories page", function() {
            webCategories.listCategories(req, res);

            sinon.assert.calledOnce(res.render);
            expect(res.render.args[0][0]).that.is.a('string').to.contain('listCategories');
        });
    });

    describe("addCategory", function() {
        it("should render add category page", function() {
            webCategories.addCategory(req, res);

            sinon.assert.calledOnce(res.render);
            expect(res.render.args[0][0]).that.is.a('string').to.contain('addCategory');
        });
    });

    describe("technologiesForCategory", function() {
        var addCategorySpy,
            testData = "test",
            cacheSpy;

        beforeEach(function() {
            req.params = {category: "test category"};

            addCategorySpy = sinon.stub(technology, 'getAllForCategory', function(data, cb) {
                cb(testData);
            });
            cacheSpy = sinon.stub(cache, 'getCategory', function(value) {
            });
        });

        afterEach(function() {
            technology.getAllForCategory.restore();
            cache.getCategory.restore();
        });

        it("should render category radar page", function() {
            webCategories.technologiesForCategory(req, res);

            sinon.assert.calledOnce(res.render);
            expect(res.render.args[0][0]).that.is.a('string').to.contain('categoryRadar');
        });

        it("should call technology dao", function() {
            webCategories.technologiesForCategory(req, res);

            sinon.assert.calledOnce(technology.getAllForCategory);
            expect(addCategorySpy.getCalls()[0].args[0]).that.is.a('string').to.equal(req.params.category);
        });

        it("should decode URI encoded category name", function() {
            var categoryDecoded = "test category encoded";
            req.params.category = encodeURI(categoryDecoded);
            webCategories.technologiesForCategory(req, res);

            sinon.assert.calledOnce(technology.getAllForCategory);
            expect(addCategorySpy.getCalls()[0].args[0]).that.is.a('string').to.equal(categoryDecoded);
        });

        it("should retrieve cached category object", function() {
            webCategories.technologiesForCategory(req, res);

            sinon.assert.calledOnce(cache.getCategory);
            expect(cacheSpy.getCalls()[0].args[0]).that.is.a('string').to.equal(req.params.category);
        });
    });
});
