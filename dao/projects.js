var pg = require('pg');
var dbhelper = require('../utils/dbhelper.js');

var Projects = function () {
};

/**
 * Get all the projects
 * @param done function to call with the results
 */
Projects.getAll = function( done ) {
    dbhelper.getAllFromTable("PROJECTS" , done );
}


/**
 * Add a new project
 * @param name Name of the project to add
 * @done function to call with the result
 */
Projects.add = function ( name, done) {
    var sql = "INSERT INTO projects ( name ) values ( $1  ) returning id";
    var params = [ name ];

    dbhelper.insert( sql, params ,
        function( result ) {
            done( result.rows[0].id );
        },
        function(error) {
            console.log(error);
            done(null , error );
        } );
}

/**
 * Delete a set of projects using their ID numbers
 * @param ids
 * @param done
 */
Projects.delete = function (ids, done) {
    dbhelper.deleteByIds( "PROJECTS" , ids , done );
}

module.exports = Projects;