"use strict";

const cache = require('../../dao/cache.js');
const category = require('../../dao/category.js');

const sanitizer = require('sanitize-html');
const apiutils = require('./apiUtils.js');

const CategoriesApiHandler = function () {
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

/**
 * Delete a category by ID
 * @param app
 * @returns {Function}
 */
CategoriesApiHandler.deleteCategories = function (app) {
    return function (req, res) {
        const data = req.body.id ;

        category.delete( data , function( result , error ) {
            if(result) {
                cache.refresh(app);
            }
            apiutils.handleResultSet( res, result , error );
        });
    }
};

module.exports = CategoriesApiHandler;