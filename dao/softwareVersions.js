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

/**
 * Update a version
 * @param version ID of the version to update
 * @param name New name for this version
 * @param done Function to call with the results
 */
SoftwareVersions.update = function (version, name, done) {
    var params = [version, name];
    var sql = `UPDATE software_versions SET name=
        COALESCE(
            (SELECT $2::varchar WHERE NOT EXISTS (SELECT 1 FROM software_versions WHERE name = $2)),
            -- use the original name if the new name is a duplicate
            name)
        WHERE id=$1`;

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
 * Remove a set of versions using their ID numbers
 * @param versions An array of version IDs
 * @param done
 */
SoftwareVersions.delete = function (versions, done) {
    dbhelper.deleteByIds("software_versions" , versions, done );
}

module.exports = SoftwareVersions;