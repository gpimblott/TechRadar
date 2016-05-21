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
 * Get a project by ID
 * @param id ID of the project to get
 * @param done Function to call with the result
 */
Projects.findById = function(id, done) {
    var sql = "SELECT *" +
        " FROM projects " +
        " where projects.id=$1 ";

    dbhelper.query( sql, [id],
        function (results) {
            done(null , results[0]);
        },
        function (error) {
            console.log(error);
            return done(error, null);
        });
};

/**
 * Get all projects linked to a given technology
 *
 * @technologyId
 * @param done function to call with the results
 */
Projects.getAllForTechnology = function(technologyId, done) {
    var sql = "SELECT p.* from projects p" +
        " INNER JOIN technology_project_link tpl on p.id = tpl.projectid" +
        " where tpl.technologyid = $1";
    var params = [technologyId];

    dbhelper.query(sql, params, done,
        function (error) {
            console.log(error);
            return done(null, error);
        });
};


/**
 * Add a new project
 * @param name Name of the project to add
 * @done function to call with the result
 */
Projects.add = function ( name, description, done) {
    var sql = "INSERT INTO projects ( name, description ) values ( $1 , $2 ) returning id";
    var params = [ name, description ];

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

/**
 * Update project data
 */
Projects.update = function (id, name, description, done) {
    var sql = "UPDATE projects SET name=$1, description=$2 where id=$3";
    var params = [name, description, id];

    dbhelper.query(sql, params,
        function(result) {
            done(true);
        },
        function(error) {
            console.log(error);
            done(false, error);
        });
};

module.exports = Projects;