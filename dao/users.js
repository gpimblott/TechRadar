var pg = require('pg');
var dbhelper = require('../utils/dbhelper.js');

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
 * Get a user by email
 * @param email Email of the user to search for
 * @param done Function to call with the result
 */
Users.findByEmail = function(email, done) {
    var sql = "SELECT u.* FROM users u where u.email=$1";
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
 * Add a new user
 * @param username Username to insert
 * @param displayName Full name of the user
 * @param password Password for the user
 * @param admin Is the user an admin (boolean)
 * @param done Function to call when complete
 */
Users.add = function (username, email, displayName, password, admin, enabled, done) {

    var userHash = require('crypto').createHash('sha256').update(password).digest('base64');

    var sql = "INSERT INTO users (username, email, displayName, password, role, enabled) values ($1, $5, $2, $3, $4, $6) returning id";
    var params = [username, displayName, userHash, admin, email, enabled];

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
 * @param id Target users ID
 * @param displayName New display name
 * @param password New password
 * @param avatarData Avatar image buffer, empty - no avatar update
 * @param role User role
 * @param done Callback
 */
Users.update = function (id, email, displayName, passwordHash, avatarData, role, enabled, done) {
    var params = [displayName, passwordHash, role, id, email, enabled];

    var avatarUpdate = '';
    if(avatarData) {
        avatarUpdate = ', avatar=$7';
        params.push('\\x' + avatarData.toString('hex'));
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

/**
 * Add a new password reset code for a user
 *
 * @param userId Users ID
 * @param resetCode Reset code which the user should use
 * @param expiresDate Date when the password reset code should expire
 * @param callback Function to call when complete
 */
Users.addPasswordResetCode = function (userId, resetCode, expiresDate, callback) {

    var sql = "INSERT INTO reset_codes (\"userId\", \"resetCode\", \"resetCodeExpires\") values ($1, $2, $3) returning id";
    var params = [userId, resetCode, expiresDate];

    dbhelper.insert(sql, params,
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

    var sql = "SELECT u.* FROM users u " +
        "inner join reset_codes rc on u.id = rc.\"userId\" where rc.\"resetCode\"=$1";

    var params = [resetCode];
    dbhelper.query(sql, params,
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

    var params = [resetCode];
    var sql = "DELETE FROM reset_codes WHERE \"resetCode\"=$1";

    dbhelper.query(sql, params,
        function(result) {
            callback(true);
        },
        function(error) {
            console.log(error);
            callback(false, error);
        });
};

module.exports = Users;
