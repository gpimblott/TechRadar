var pg = require('pg');
var dbhelper = require('../utils/dbhelper.js');

/**
 * Database routines for 'Category's'
 * @constructor
 */
var Category = function () {
};


Category.getAll = function(done) {
    var sql = "SELECT * " +
        " FROM categories";


    dbhelper.query(sql, [],
        function (results) {
            done( results);
        },
        function (error) {
            console.log(error);
            return done( null );
        });
}

Category.getAll = function (done) {
    var sql = "SELECT * FROM categories ";

    dbhelper.query(sql, [],
        function (results) {
            done(results);
        },
        function (error) {
            console.log(error);
            done(null);
        });
}

module.exports = Category;