var pg = require('pg');
var dbhelper = require('../utils/dbhelper.js');


var Technology = function () {
};




/**
 * Add a new technology
 */
Technology.add = function (name, website, category, description, done) {
    var sql = "INSERT INTO technologies ( name , website, category , description ) values ($1, $2, $3, $4 ) returning id";
    var params = [ name , website , category , description  ];

    dbhelper.insert( sql, params ,
        function( result ) {
            done( result.rows[0].id );
        },
        function(error) {
            console.log(error);
            done(null);
        } );
}

/**
 * Add a new technology
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
            done(null);
        } );
}

/**
 * Get a specific technology using its ID
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
            return done( null );
        });
}

Technology.getAllForCategory = function (cname, done) {

    var sql = "SELECT row_number() over (order by s) as num, t.id, t.name as name, t.website as website, t.description, s.name as status, c.name as category " +
        " FROM technologies t" +
        " INNER JOIN categories c on t.category=c.id" +
        " LEFT JOIN tech_status_link tsl on t.id=tsl.technologyid " +
        " LEFT OUTER JOIN tech_status_link tsl2 ON (t.id = tsl2.technologyid AND " +
        "(tsl.date < tsl2.date OR tsl.date = tsl2.date AND tsl.id < tsl2.id)) " +
        " INNER JOIN STATUS s on COALESCE(tsl.statusid, 0)=s.id" +
        " WHERE tsl2.id IS NULL AND LOWER(c.name)=$1";

    dbhelper.query( sql, [cname] ,
        function( results ) {
            done(results);
        },
        function( error ) {
            console.log(error);
            done(null);
        } );
}

Technology.search = function (value, done) {
    
    var sql = "SELECT technologies.id, technologies.name,status.name as Status,categories.name as Category" +
        " FROM technologies" +
        " INNER JOIN categories on technologies.category=categories.id " +
        " LEFT JOIN tech_status_link tsl on technologies.id=tsl.technologyid " +
        " LEFT OUTER JOIN tech_status_link tsl2 ON (technologies.id = tsl2.technologyid AND " +
        "(tsl.date < tsl2.date OR tsl.date = tsl2.date AND tsl.id < tsl2.id)) " +
        " INNER JOIN STATUS on COALESCE(tsl.statusid, 0)=status.id" +
        " WHERE technologies.name ILIKE '%" + value + "%' AND tsl2.id IS NULL";
    
    dbhelper.query( sql, [] ,
        function( results ) {
            done(results);
        },
        function( error ) {
            console.log(error);
            done(null);
        } );
}

module.exports = Technology;