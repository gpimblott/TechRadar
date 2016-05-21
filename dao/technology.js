var pg = require('pg');
var dbhelper = require('../utils/dbhelper.js');


var Technology = function () {
};


/**
 * Add a new technology
 * @param name Name of the technology
 * @param website Website for the technology
 * @param category Category ID for the technology
 * @param description Textual description of the technology
 * @param done Function to call when stored
 * @returns ID of the row created
 */
Technology.add = function (name, website, category, description, done) {
    var sql = "INSERT INTO technologies ( name , website, category , description ) values ($1, $2, $3, $4 ) returning id";
    var params = [ name , website , category , description  ];

    dbhelper.insert( sql, params ,
        function( result ) {
            done( result.rows[0].id );
        },
        function(error) {
            done( null, error );
        } );
}

/**
 * Add a new technology
 * @param id ID of the technology
 * @param name Name of the technology
 * @param website Website for the technology
 * @param category Category ID for the technology
 * @param description Textual description of the technology
 * @param done Function to call when stored
 * @returns true/false
 */
Technology.update = function (id, name, website, category, description, done) {
    var sql = "UPDATE technologies SET name=$1 , website=$2, category=$3 , description=$4 where id=$5";
    var params = [ name , website , category , description , id ];


    dbhelper.insert( sql, params ,
        function( result ) {
            done( true );
        },
        function( error ) {
            console.log(error);
            done( false , error );
        } );
}

/**
 * Delete a set of technologies using their ID numbers
 * @param ids
 * @param done
 */
Technology.delete = function (ids, done) {

    var params = [];
    for(var i = 1; i <= ids.length; i++) {
        params.push('$' + i);
    }

    var sql = "DELETE FROM TECHNOLOGIES WHERE id IN (" +  params.join(',') + "  )";


    dbhelper.query( sql, ids ,
        function( result ) {
            done( true );
        },
        function( error ) {
            console.log(error);
            done( false , error );
        } );
}

/**
 * Update the status for a technology
 * @param technology Technology ID
 * @param status Status ID
 * @param reason Reason for the change
 * @param userid UserID making the change
 * @param done Function to call when the update is finished
 */
Technology.updateStatus = function (technology, status, reason, userid, done) {
    var sql = "INSERT INTO tech_status_link ( technologyid ,statusid , userid , reason ) VALUES ( $1 , $2 , $3 , $4) returning id";
    var params = [ technology, status , userid, reason ];

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
 * Get a specific technology using its ID
 * @param id ID of the technology
 * @param done Function to call with the results
 */
Technology.getById = function (id, done) {
    var sql = "SELECT t.* ,s.name as statusName, s.id as status, c.name as categoryName FROM technologies t" +
        " INNER JOIN categories c on t.category=c.id " +
        " LEFT JOIN tech_status_link tsl on t.id=tsl.technologyid " +
        " LEFT OUTER JOIN tech_status_link tsl2 ON (t.id = tsl2.technologyid AND " +
        "(tsl.date < tsl2.date OR tsl.date = tsl2.date AND tsl.id < tsl2.id)) " +
        " INNER JOIN STATUS s on COALESCE(tsl.statusid, 0)=s.id" +
        " where t.id=$1 AND tsl2.id IS NULL";

    dbhelper.query( sql, [id] ,
        function( results ) {
            if (results.length != 1) {
                done(null);
            } else {
                done(results[0]);
            }
        },
        function( error ) {
            console.log(error);
            done(null);
        } );
}

/**
 * Get all technologies
 * @param done Function to call with the results
 */
Technology.getAll = function( done) {
    var sql = "SELECT t.id, t.name as name, t.website as website, t.description, s.name as status, c.name as category " +
        " FROM technologies t" +
        " INNER JOIN categories c on t.category=c.id" +
        " LEFT JOIN tech_status_link tsl on t.id=tsl.technologyid " +
        " LEFT OUTER JOIN tech_status_link tsl2 ON (t.id = tsl2.technologyid AND " +
            "(tsl.date < tsl2.date OR tsl.date = tsl2.date AND tsl.id < tsl2.id)) " +
        " INNER JOIN STATUS s on COALESCE(tsl.statusid, 0)=s.id" +
        " WHERE tsl2.id IS NULL;";

    dbhelper.query(sql, [],
        function (results) {
            done( results);
        },
        function (error) {
            console.log(error);
            return done( null , error );
        });
}


/**
 * Get all of the technologies in a category
 * @param cname Name of the category
 * @param done Function to call with the results
 */
Technology.getAllForCategory = function (cname, done) {

    var sql = "SELECT row_number() over (order by s) as num, t.id, t.name as name, t.website as website, t.description, s.name as status, c.name as category " +
        " FROM technologies t" +
        " INNER JOIN categories c on t.category=c.id" +
        " LEFT JOIN tech_status_link tsl on t.id=tsl.technologyid " +
        " LEFT OUTER JOIN tech_status_link tsl2 ON (t.id = tsl2.technologyid AND " +
        "(tsl.date < tsl2.date OR tsl.date = tsl2.date AND tsl.id < tsl2.id)) " +
        " INNER JOIN STATUS s on COALESCE(tsl.statusid, 0)=s.id" +
        " WHERE tsl2.id IS NULL AND LOWER(c.name)=$1" +
        " ORDER BY status, t.name ASC";


    dbhelper.query( sql, [cname] ,
        function( results ) {
            done(results);
        },
        function( error ) {
            console.log(error);
            done(null);
        } );
}

/**
 * Search for technologies
 * @param value String to search for
 * @param done Function to call with the results
 */
Technology.search = function (value, done) {
    
    var sql = "SELECT technologies.id, technologies.name,status.name as Status,categories.name as Category" +
        " FROM technologies" +
        " INNER JOIN categories on technologies.category=categories.id " +
        " LEFT JOIN tech_status_link tsl on technologies.id=tsl.technologyid " +
        " LEFT OUTER JOIN tech_status_link tsl2 ON (technologies.id = tsl2.technologyid AND " +
        "(tsl.date < tsl2.date OR tsl.date = tsl2.date AND tsl.id < tsl2.id)) " +
        " INNER JOIN STATUS on COALESCE(tsl.statusid, 0)=status.id" +
        " WHERE technologies.name ILIKE $1 AND tsl2.id IS NULL";
    
    dbhelper.query( sql, ['%'+value+'%'] ,
        function( results ) {
            done(results);
        },
        function( error ) {
            console.log(error);
            done(null);
        } );
}

/**
 * Add a project to a technology
 *
 * @param technologyId Technology ID
 * @param projectId Project ID
 * @param callback Function to call when the update is finished
 */
Technology.addProject = function (technologyId, projectId, callback) {
    var sql = "INSERT INTO technology_project_link (technologyid, projectid) VALUES ($1, $2)";
    var params = [technologyId, projectId];

    dbhelper.insert(sql, params,
        function(result) {
            callback(result);
        },
        function(error) {
            console.log(error);
            callback(null, error);
        });
};

/**
 * Remove projects from a technology
 *
 * @param technologyId Technology ID
 * @param projectIds Project IDs
 * @param callback Function to call when the deletion is finished
 */
Technology.removeProjects = function (technologyId, projectIds, callback) {
    var idPlaceholders = [];
    for(var i = 2; i <= projectIds.length + 1; i++) {
        idPlaceholders.push('$' + i);
    }

    var sql = "DELETE FROM technology_project_link" +
        " WHERE technologyid = $1 " +
        " and projectid IN (" +  idPlaceholders.join(',') + ")";

    var params = [technologyId];
    params = params.concat(projectIds);

    dbhelper.query(sql, params,
        function(result) {
            callback(true);
        },
        function(error) {
            console.log(error);
            callback(false, error);
        });
};

module.exports = Technology;