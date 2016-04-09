var pg = require('pg');
var db = require('../config/dbConfig.js');
var dbhelper = require('../dao/dbhelper.js');


var Technology = function () {
};


/**
 * Add a new technology
 */
Technology.add = function (name, website, category, description, status, done) {
    var sql = "INSERT INTO technologies ( name , website, category , description, status) values ($1, $2, $3, $4, $5) returning id";
    var params = [ name , website , category , description , status ];

    dbhelper.insert( sql, params ,
        function( result ) {
            console.log( result );
            done( result.rows[0].id );
        },
        function(error) {
            console.log(error);
        } );
}

/**
 * Get a specific technology using its ID
 */
Technology.getById = function (id, done) {
    var sql = "SELECT * FROM technologies where id=$1";

    dbhelper.query( sql, [id] ,
        function( results ) {
            done(results);
        },
        function( error ) {
            console.log(error);
        } );
}

Technology.getValuesForCategory = function (cname, done) {


    var sql = "SELECT row_number() OVER (ORDER BY status) as num, technologies.id as id, technologies.name as name, status.name as status, categories.name as category " +
        " FROM technologies " +
        " inner join status on technologies.status=status.id " +
        " inner join categories on technologies.category=categories.id " +
        " where lower(categories.name)=$1";

    dbhelper.query( sql, [cname] ,
        function( results ) {
            done(results);
        },
        function( error ) {
            console.log(error);
        } );
}

Technology.search = function (value, done) {
    
    var sql = "SELECT technologies.id, technologies.name,status.name as Status,categories.name as Category" +
        " FROM technologies" +
        " inner join status on technologies.status=status.id " +
        " inner join categories on technologies.category=categories.id " +
        " WHERE technologies.name ILIKE '%" + value + "%'"
    
    dbhelper.query( sql, [] ,
        function( results ) {
            done(results);
        },
        function( error ) {
            console.log(error);
        } );
}

module.exports = Technology;