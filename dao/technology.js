var pg = require('pg');
var db = require('../config/dbConfig.js');
var dbhelper = require('../dao/dbhelper.js');


var Technology = function () {
};


Technology.getAll = function(done) {
    var sql = "SELECT t.id, t.name as name, t.website as website, t.description, s.name as status, c.name as category " +
        " FROM technologies t" +
        " INNER JOIN categories c on t.category=c.id" +
        " INNER JOIN status s on t.status=s.id";


    dbhelper.query(sql, [],
        function (results) {
            done( results);
        },
        function (error) {
            console.log(error);
            return done( null );
        });
}

/**
 * Add a new technology
 */
Technology.add = function (name, website, category, description, status, done) {
    var sql = "INSERT INTO technologies ( name , website, category , description, status) values ($1, $2, $3, $4, $5) returning id";
    var params = [ name , website , category , description , status ];

    dbhelper.insert( sql, params ,
        function( result ) {
            done( result.rows[0].id );
        },
        function(error) {
            console.log(error);
            done(null);
        } );
}

/**
 * Add a new technology
 */
Technology.updateStatus = function (technology, status, done) {
    var sql = "UPDATE technologies SET status=$1 where id=$2";
    var params = [ status, technology ];

    dbhelper.query( sql, params ,
        function( result ) {
            done( result );
        },
        function(error) {
            console.log(error);
            done(null);
        } );
}

/**
 * Get a specific technology using its ID
 */
Technology.getById = function (id, done) {
    var sql = "SELECT t.* ,s.name as statusName, c.name as categoryName FROM technologies t" +
        " inner join status s on t.status=s.id " +
        " inner join categories c on t.category=c.id " +
        " where t.id=$1";

    dbhelper.query( sql, [id] ,
        function( results ) {
            done(results);
        },
        function( error ) {
            console.log(error);
            done(null);
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
            done(null);
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
            done(null);
        } );
}

module.exports = Technology;