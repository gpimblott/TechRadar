var pg = require('pg');
var dbhelper = require('../utils/dbhelper.js');

/**
 * Database routines for 'Category's'
 */
var Category = function () {
};

/**
 * Get all the Categories
 * @param done function to call with the results
 */
Category.getAll = function(done) {
    var sql = "SELECT * FROM categories";
    
    dbhelper.query(sql, [],
        function (results) {
            done( results);
        },
        function (error) {
            console.log(error);
            return done( null );
        });
}


module.exports = Category;