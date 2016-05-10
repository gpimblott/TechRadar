var pg = require('pg');
var dbhelper = require('../utils/dbhelper.js');

var Stacks = function () {
};

/**
 * Get all the stack
 * @param done function to call with the results
 */
Stacks.getAll = function( done ) {
    dbhelper.getAllFromTable("STACKS" , done );
}


/**
 * Add a new stack
 * @param name Name of the stack to add
 * @done function to call with the result
 */
Stacks.add = function ( name, description, done) {
    var sql = "INSERT INTO stacks ( name, description ) values ( $1 , $2 ) returning id";
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
 * Delete a set of stacks using their ID numbers
 * @param ids
 * @param done
 */
Stacks.delete = function (ids, done) {
    dbhelper.deleteByIds( "STACKS" , ids , done );
}

module.exports = Stacks;