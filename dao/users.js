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
    var sql = "SELECT u.id, u.username, u.displayName, u.password, u.role, u.enabled FROM users u where u.username=$1";
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
 * @param username Username to insert
 * @param displayName Full name of the user
 * @param password Password for the user
 * @param admin Is the user an admin (boolean)
 * @param done Function to call when complete
 */
Users.add = function (username, displayName, password, admin, done) {

    var userHash = require('crypto').createHash('sha256').update(password).digest('base64');

    var sql = "INSERT INTO users ( username, displayName, password, role) values ( $1 , $2 , $3 ,$4 ) returning id";
    var params = [ username,displayName,userHash,admin ];

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
Users.update = function (id, displayName, passwordHash, avatarData, role, done) {
    var params = [displayName, passwordHash, role, id];

    var avatarUpdate = '';
    if(avatarData) {
        avatarUpdate = ', avatar=$5';
        params.push('\\x' + avatarData.toString('hex'));
    }
    var sql = "UPDATE users SET displayName=$1, password=$2" + avatarUpdate + ", role=$3 where id=$4";

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