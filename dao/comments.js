var db = require('../config/dbConfig.js');
var pg = require('pg');
var dbhelper = require('../utils/dbhelper.js');

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
Comments.getForTechnology = function (technology, done) {
    var sql = "SELECT comments.*, users.displayName, users.username FROM comments " +
        " inner join users on comments.userid=users.id" +
        " where technology=$1 order by date desc";

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
Comments.add = function (technology, text , userid, done) {
    var sql = "INSERT INTO comments ( technology , text , userid) values ( $1 , $2 , $3 ) returning id";
    var params = [ technology, text, userid ];

    dbhelper.insert( sql, params ,
        function( result ) {
            console.log( result );
            done( result.rows[0].id );
        },
        function(error) {
            console.log(error);
            done(null);
        } );
}

module.exports = Comments;