var db = require('../config/dbConfig.js');
var pg = require('pg');
var dbhelper = require('../dao/dbhelper.js');

/**
 * Database routines for 'Comments'
 * @constructor
 */
var Comments = function () {
};

/**
 * Get all the comments for the given technology
 * @param technology
 * @param done
 */
Comments.getValuesForTechnology = function (technology, done) {
    var sql = "SELECT * FROM comments where technology=$1 order by date desc";

    dbhelper.query(sql, [technology],
        function (results) {
            done(results);
        },
        function (error) {
            console.log(error);
        });
};

/**
 * Add a new comment
 */
Comments.add = function (technology, text , done) {
    var sql = "INSERT INTO comments ( technology , text ) values ( $1 , $2 ) returning id";
    var params = [ technology, text ];

    dbhelper.insert( sql, params ,
        function( result ) {
            console.log( result );
            done( result.rows[0].id );
        },
        function(error) {
            console.log(error);
        } );
}

module.exports = Comments;