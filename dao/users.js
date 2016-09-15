var pg = require('pg');
var dbhelper = require('../utils/dbhelper.js');
var User = require('../models/User');

var Users = function () {
};


/**
 * Get all users 
 * @param done Function to call with the results
 */
Users.getAll = function(done) {
    var sql = "SELECT users.*,roles.admin as isAdmin ,roles.name as rolename" +
        " FROM users " +
        " INNER JOIN roles on users.role=roles.id";

    dbhelper.query(sql, [],
        function (results) {
            done( results);
        },
        function (error) {
            console.log(error);
            return done( null );
        });
};

/**
 * Get a user by ID
 * @param id ID of the user to get
 * @param done Function to call with the result
 */
Users.findById = function(id, done) {
    var sql = "SELECT users.*,roles.admin,roles.name as rolename" +
            " FROM users " +
            " INNER JOIN roles on users.role=roles.id" +
            " where users.id=$1 ";

    dbhelper.query( sql, [id],
        function (results) {
            done(null , results[0]);
        },
        function (error) {
            console.log(error);
            return done(error, null);
        });
};

/**
 * Get a user by email
 * @param email Email of the user to search for
 * @param done Function to call with the result
 */
Users.findByEmail = function(email, done) {
    var sql = "SELECT u.id, u.username, u.displayName, u.password, u.role, u.enabled, u.email FROM users u where u.email=$1";
    var params = [email];
    dbhelper.query(sql, params,
        function (results) {
            done(null , results[0]);
        },
        function (error) {
            console.log(error);
            return done( null , null );
        });
};

/**
 * Get a user by username
 * @param username Username of the user to search for
 * @param done Function to call with the result
 */
Users.findByUsername = function(username, done) {
    var sql = "SELECT u.id, u.username, u.displayName, u.password, u.role, u.enabled, u.email FROM users u where u.username=$1";
    var params = [username];
    dbhelper.query(sql, params,
        function (results) {
            done(null , results[0]);
        },
        function (error) {
            console.log(error);
            return done( null , null );
        });
};

/**
 * Add a new user
 * @param user User to insert
 * @param done Function to call when complete
 */
Users.add = function (user, done) {

    var userHash = require('crypto').createHash('sha256').update(user.password).digest('base64');

    var sql = "INSERT INTO users (username, email, displayName, password, role, enabled) values ($1, $2, $3, $4, $5, $6) returning id";
    
    var params = [user.username, user.email, user.displayName, userHash, user.role, user.enabled];

    dbhelper.insert( sql, params ,
        function( result ) {
            done( result.rows[0].id , null );
        },
        function(error) {
            console.log(error);
            done(null , error );
        } );
};

/**
 * Delete a set of users using their ID numbers
 * @param ids
 * @param done
 */
Users.delete = function (ids, done) {

    var params = [];
    for(var i = 1; i <= ids.length; i++) {
        params.push('$' + i);
    }

    var sql = "DELETE FROM USERS WHERE id IN (" +  params.join(',') + "  )";

    dbhelper.query( sql, ids ,
        function( result ) {
            done( true );
        },
        function( error ) {
            console.log(error);
            done( false , error );
        } );
};

/**
 * Update user data
 *
 * @param user User with updated fields
 * @param done Callback
 */
Users.update = function (user, done) {
    var params = [user.displayName, user.password, user.role, user.id, user.email, user.enabled];

    var avatarUpdate = '';
    if(user.avatar) {
        avatarUpdate = ', avatar=$7';
        params.push('\\x' + user.avatar.toString('hex'));
    }
    var sql = "UPDATE users SET displayName=$1, password=$2" + avatarUpdate + ", role=$3, email=$5, enabled=$6 where id=$4";

    dbhelper.query(sql, params,
        function(result) {
            done(true);
        },
        function(error) {
            console.log(error);
            done(false, error);
        });
};

/**
 * Retrieve users avatar
 *
 * @param username
 * @param done Callback
 */
Users.getAvatar = function (username, done) {
    var sql = "SELECT u.avatar FROM users u where u.username=$1";

    dbhelper.query(sql, [username],
        function (results) {
            if(results[0].avatar) {
                done(new Buffer(results[0].avatar));
            } else {
                done(new Buffer(""));
            }
        },
        function (error) {
            console.log(error);
            done(null, error);
        });
};

module.exports = Users;
