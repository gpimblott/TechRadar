var db = require('../config/dbConfig.js');
var pg = require('pg');
var dbhelper = require('../dao/dbhelper.js');

/**
 * Database routines for 'Category's'
 * @constructor
 */
var Category = function () {
};


Category.getValuesForCategory = function (done) {
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