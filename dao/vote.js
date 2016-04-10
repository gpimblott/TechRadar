var db = require('../config/dbConfig.js');
var pg = require('pg');
var dbhelper = require('../dao/dbhelper.js');


var Vote = function () {
};


Vote.getVotesForTechnology = function (techid, done) {
    var sql = "SELECT * FROM votes where technology=$1 ";

    dbhelper.query(sql, [techid],
        function (results) {
            done(results);
        },
        function (error) {
            console.log(error);
        });
}

/**
 * Add a new technology
 */
Vote.add = function (technology, status, userid, done ) {
    var sql = "INSERT INTO votes ( technology, status, userid ) values ($1, $2, $3) returning id";
    var params = [ technology, status, userid ];

    dbhelper.insert( sql, params ,
        function( result ) {
            console.log( result );
            done( result.rows[0].id , null);
        },
        function(error) {
            done( null , error );
        } );
}

module.exports = Vote;