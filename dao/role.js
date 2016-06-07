var pg = require('pg');
var dbhelper = require('../utils/dbhelper.js');

/**
 * Database routines for 'Role's'
 */
var Role = function () {
};

/**
 * Get all the Roles
 * @param done function to call with the results
 */
Role.getAll = function(done) {
    dbhelper.getAllFromTable("roles", done, "name"  );
}



module.exports = Role;