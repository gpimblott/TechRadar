var db = require('../config/dbConfig.js');
var pg = require('pg');
var dbhelper = require('../dao/dbhelper.js');


exports.getAll = function(done) {
    var sql = "SELECT *" +
        " FROM projects " ;

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
    var sql = "SELECT * " +
            " FROM projects " +
            " where id=$1 ";

    dbhelper.query(sql, [id],
        function (results) {
            done(null , results[0]);
        },
        function (error) {
            console.log(error);
            return done( null , null );
        });
}


/**
 * Add a new project
 */
exports.add = function ( name, done) {
    var sql = "INSERT INTO projects ( name ) values ( $1  ) returning id";
    var params = [ name ];

    dbhelper.insert( sql, params ,
        function( result ) {
            done( result.rows[0].id );
        },
        function(error) {
            console.log(error);
            done(null);
        } );
}