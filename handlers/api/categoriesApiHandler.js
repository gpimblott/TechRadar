var cache = require('../../dao/cache.js');
var category = require('../../dao/category.js');

var sanitizer = require('sanitize-html');
var apiutils = require('./apiUtils.js');

var CategoriesApiHandler = function () {
};

/**
 * Get all categories
 */
CategoriesApiHandler.getCategories = function (req, res) {
    category.getAll(function (result) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    });
};

CategoriesApiHandler.addCategory = function (app) {
    return function (req, res) {
        category.add(
            sanitizer( req.body.name ),
            sanitizer( req.body.description ),
            function (result , error ) {
                if(result) {
                    cache.refresh(app);
                }
                apiutils.handleResultSet( res, result , error );
            });
    }
};

CategoriesApiHandler.deleteCategories = function (app) {
    return function (req, res) {
        var data = req.body.id ;

        category.delete( data , function( result , error ) {
            if(result) {
                cache.refresh(app);
            }
            apiutils.handleResultSet( res, result , error );
        });
    }
};

module.exports = CategoriesApiHandler;