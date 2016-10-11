var pg = require('pg');
var dbhelper = require('../utils/dbhelper.js');

var SoftwareVersions = function () {
};

/**
 * Get all versions that belong to a technology
 * @param done Function to call with the results
 */
SoftwareVersions.getAllForTechnology = function (technology, done) {
    var sql = "SELECT * from software_versions WHERE technology=$1";
    var params = [technology];

    dbhelper.query(sql, params,
        function (results) {
            done(results);
        },
        function (error) {
            console.log(error);
            done(null);
        });
}

/**
 * Add a new version that's assigned to a single technology
 * @param done Function to call with the results
 */
SoftwareVersions.add = function (technology, name, done) {
    var sql = `INSERT INTO software_versions(technology, name)
        VALUES($1, $2) RETURNING id`;
    var params = [technology, name];

    dbhelper.insert(sql, params,
        function (results) {
            done(results);
        },
        function (error) {
            console.log(error);
            done(null);
        });
}

module.exports = SoftwareVersions;