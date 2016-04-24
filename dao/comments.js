var pg = require('pg');
var dbhelper = require('../utils/dbhelper.js');

/**
 * Database routines for 'Comments'
 */
var Comments = function () {
};

/**
 * Get all the comments for the given technology
 * @param technology ID of the technology to gtet comments for
 * @param done function to call with the results
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
 * @param technology Technology ID that the commment should be added to
 * @param text Comment text to add
 * @param userid User ID adding the comment
 * @param done function to call with the results
 */
Comments.add = function (technology, text , userid, done) {
    var sql = "INSERT INTO comments ( technology , text , userid) values ( $1 , $2 , $3 ) returning id";
    var params = [ technology, text, userid ];

    dbhelper.insert( sql, params ,
        function( result ) {
            done( result.rows[0].id );
        },
        function(error) {
            console.log(error);
            done(null);
        } );
}

module.exports = Comments;