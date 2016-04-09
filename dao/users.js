var db = require('../config/dbConfig.js');
var pg = require('pg');
var dbhelper = require('../dao/dbhelper.js');


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