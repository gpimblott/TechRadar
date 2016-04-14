var db = require('../config/dbConfig.js');
var pg = require('pg');
var dbhelper = require('../utils/dbhelper.js');


exports.getAll = function(done) {
    var sql = "SELECT users.*,roles.admin as isAdmin ,roles.name as roleName" +
        " FROM users " +
        " INNER JOIN roles on users.role=roles.id";

    dbhelper.query(sql, [],
        function (results) {
            done( results);
        },
        function (error) {
            console.log(error);
            return done( null );
        });
}

exports.findById = function(id, done) {
    var sql = "SELECT users.*,roles.admin,roles.name " +
            " FROM users " +
            " INNER JOIN roles on users.role=roles.id" +
            " where users.id=$1 ";

    dbhelper.query(sql, [id],
        function (results) {
            done(null , results[0]);
        },
        function (error) {
            console.log(error);
            return done( null , null );
        });
}

exports.findByUsername = function(username, done) {
    var sql = "SELECT * FROM users where username=$1 ";
    
    dbhelper.query(sql, [username],
        function (results) {
            done(null , results[0]);
        },
        function (error) {
            console.log(error);
            return done( null , null );
        });
}

/**
 * Add a new user
 */
exports.add = function (username, displayName, password, admin, done) {
    var sql = "INSERT INTO users ( username, displayName, password, role) values ( $1 , $2 , $3 ,$4 ) returning id";
    var params = [ username,displayName,password,admin ];

    dbhelper.insert( sql, params ,
        function( result ) {
            done( result.rows[0].id );
        },
        function(error) {
            console.log(error);
            done(null);
        } );
}