var pg = require('pg');
var dbhelper = require('../utils/dbhelper.js');

/**
 * Database routines for 'Category's'
 */
var Category = function () {
};

/**
 * Get all the Categories
 * @param done function to call with the results
 */
Category.getAll = function(done) {
    dbhelper.getAllFromTable("CATEGORIES", done, "name"  );
}

/**
 * Add a new category
 * @param name Name of the project to add
 * @done function to call with the result
 */
Category.add = function ( name, description, done) {
    var sql = "INSERT INTO categories ( name, description ) values ( $1 , $2  ) returning id";
    var params = [ name , description ];

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
 * Delete a set of categories using their ID numbers
 * @param ids
 * @param done
 */
Category.delete = function (ids, done) {
    dbhelper.deleteByIds("CATEGORIES" , ids , done );
}


module.exports = Category;