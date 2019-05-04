"use strict";

const dbHelper = require('../utils/dbhelper.js');

const SoftwareVersions = function () {
};

/**
 * Get all versions that belong to a technology
 * @param technology ID of the technology to search for
 * @param done Function to call with the results
 */
SoftwareVersions.getAllForTechnology = function (technology, done) {
    const sql = `SELECT sv.id, sv.name, sv.technology, COUNT(tpl.projectid) AS projects_count from software_versions AS sv         
        LEFT OUTER JOIN technology_project_link tpl ON tpl.software_version_id = sv.id
        WHERE sv.technology=$1
        GROUP BY sv.id, sv.name, sv.technology`;
    const params = [technology];

    dbHelper.query(sql, params,
        function (results) {
            done(results);
        },
        function (error) {
            console.log(error);
            done(null);
        });
};

/**
 * Add a new version that's assigned to a single technology
 * @param technology Id of the software
 * @param name Name of the version being added
 * @param done Function to call with the results
 */
SoftwareVersions.add = function (technology, name, done) {
    const sql = `INSERT INTO software_versions(technology, name)
        VALUES($1, $2) RETURNING id`;
    const params = [technology, name];

    dbHelper.insert(sql, params,
        function (results) {
            done(results);
        },
        function (error) {
            console.log(error);
            done(null);
        });
};

/**
 * Update a version
 * @param version ID of the version to update
 * @param name New name for this version
 * @param done Function to call with the results
 */
SoftwareVersions.update = function (version, name, done) {
    const params = [version, name];
    const sql = `UPDATE software_versions SET name= $2 WHERE id=$1`;

    dbHelper.query(sql, params,
        function (results) {
            done(results);
        },
        function (error) {
            debug(error);
            done(null);
        });
};

/**
 * Remove a set of versions using their ID numbers
 * @param versions An array of version IDs
 * @param done
 */
SoftwareVersions.delete = function (versions, done) {
    dbHelper.deleteByIds("software_versions" , versions, done );
};

module.exports = SoftwareVersions;