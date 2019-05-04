"use strict";

const dbHelper = require('../utils/dbhelper.js');

const Users = function () {
};

/**
 * Get all users 
 * @param done Function to call with the results
 */
Users.getAll = function(done) {
    const sql = "SELECT users.*,roles.admin as isAdmin ,roles.name as rolename" +
        " FROM users " +
        " INNER JOIN roles on users.role=roles.id";

    dbHelper.query(sql, [],
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
    const sql = "SELECT users.*,roles.admin,roles.name as rolename" +
            " FROM users " +
            " INNER JOIN roles on users.role=roles.id" +
            " where users.id=$1 ";

    dbHelper.query( sql, [id],
        function (results) {
            done(null , results[0]);
        },
        function (error) {
            console.log(error);
            return done(error, null);
        });
};


/**
 * Get a user by username
 * @param username Username of the user to search for
 * @param done Function to call with the result
 */
Users.findByUsername = function(username, done) {
    const sql = "SELECT u.id, u.username, u.displayName, u.password, u.role, u.enabled, u.email FROM users u where u.username=$1";
    const params = [username];
    dbHelper.query(sql, params,
        function (results) {
            done(null , results[0]);
        },
        function (error) {
            console.log(error);
            return done( null , null );
        });
};

/**
 * Get a user by email
 * @param email Email of the user to search for
 * @param done Function to call with the result
 */
Users.findByEmail = function(email, done) {
    const sql = "SELECT u.* FROM users u where u.email=$1";
    const params = [email];
    dbHelper.query(sql, params,
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

    const userHash = require('crypto').createHash('sha256').update(user.password).digest('base64');
    const sql = "INSERT INTO users (username, email, displayName, password, role, enabled) values ($1, $2, $3, $4, $5, $6) returning id";
    const params = [user.username, user.email, user.displayName, userHash, user.role, user.enabled];

    dbHelper.insert( sql, params ,
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

    let params = [];
    for(var i = 1; i <= ids.length; i++) {
        params.push('$' + i);
    }

    const sql = "DELETE FROM USERS WHERE id IN (" +  params.join(',') + "  )";

    dbHelper.query( sql, ids ,
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
    const params = [user.displayName, user.password, user.role, user.id, user.email, user.enabled];

    let avatarUpdate = '';
    if(user.avatar) {
        avatarUpdate = ', avatar=$7';
        params.push('\\x' + user.avatar.toString('hex'));
    }
    const sql = "UPDATE users SET displayName=$1, password=$2" + avatarUpdate + ", role=$3, email=$5, enabled=$6 where id=$4";

    dbHelper.query(sql, params,
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
    const sql = "SELECT u.avatar FROM users u where u.username=$1";

    dbHelper.query(sql, [username],
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

/**
 * Add a new password reset code for a user
 *
 * @param userId Users ID
 * @param resetCode Reset code which the user should use
 * @param expiresDate Date when the password reset code should expire
 * @param callback Function to call when complete
 */
Users.addPasswordResetCode = function (userId, resetCode, expiresDate, callback) {

    const sql = "INSERT INTO reset_codes (\"userId\", \"resetCode\", \"resetCodeExpires\") values ($1, $2, $3) returning id";
    const params = [userId, resetCode, expiresDate];

    dbHelper.insert(sql, params,
        function(result) {
            callback(result.rows[0].id, null);
        },
        function(error) {
            console.log(error);
            callback(null, error);
        });
};

/**
 * Retrieve user associated with the given password reset code
 *
 * @param resetCode Reset code to be queried
 * @param callback Function to call when complete
 */
Users.getUserByPasswordResetCode = function (resetCode, callback) {

    const sql = "SELECT u.* FROM users u " +
        "inner join reset_codes rc on u.id = rc.\"userId\" where rc.\"resetCode\"=$1";

    const params = [resetCode];
    dbHelper.query(sql, params,
        function (results) {
            callback(results[0], null);
        },
        function (error) {
            console.log(error);
            callback(null, error);
        });
};

/**
 * Delete password reset code
 *
 * @param resetCode Reset code to be deleted
 * @param callback Function to call when complete
 */
Users.deleteResetCode = function (resetCode, callback) {

    const params = [resetCode];
    const sql = "DELETE FROM reset_codes WHERE \"resetCode\"=$1";

    dbHelper.query(sql, params,
        function(result) {
            callback(true);
        },
        function(error) {
            console.log(error);
            callback(false, error);
        });
};

module.exports = Users;
