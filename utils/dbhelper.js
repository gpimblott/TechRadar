/**
 * Helper function to perform base database operations (e.g. query, insert)
 */
var pg = require('pg');
var url = require('url')

var DBHelper = {};

pg.defaults.poolSize = 50;

var params = url.parse(process.env.DATABASE_URL);
var auth = params.auth.split(':');
var config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: process.env.USE_SSL && process.env.USE_SSL.toLowerCase() !== 'false'
};

DBHelper.pool = new pg.Pool(config);

DBHelper.pool.on('error', function (err, client) {
    console.log(err);
});

/**
 * Perform a select query operation
 * @param sql Statement to perform
 * @param parameters Parameters for the query
 * @param done Function to call on success
 * @param error Function to call on error
 */
DBHelper.query = function (sql, parameters, done, error) {
    DBHelper.pool.query(sql, parameters, function(err, result) {
        if (err) {
            error(err);
            return;
        }

        done(result.rows);
    });
};

/**
 * Perform an insert operation on the database
 * @param sql Statement to perform
 * @param parameters Parameters for the query
 * @param done Function to call on exit
 * @param error Error function to call on error
 */
DBHelper.insert = function (sql, parameters, done, error) {
    DBHelper.pool.query(sql, parameters, function(err, result) {
        if (err) {
            error(err);
            return;
        }

        done(result);
    });
};

/**
 * Wrapper around delete function to delete by a set of ids
 * @param tableName
 * @param ids array of IDS to delete
 * @param done function to call on completion
 */
DBHelper.deleteByIds = function (tableName, ids, done) {

    var params = [];
    for (var i = 1; i <= ids.length; i++) {
        params.push('$' + i);
    }

    var sql = "DELETE FROM " + tableName + " WHERE id IN (" + params.join(',') + "  )";
    
    DBHelper.query(sql, ids,
        function (result) {
            done(true);
        },
        function (error) {
            console.log(error);
            done(false, error);
        });
    
};

DBHelper.getAllFromTable = function( tableName , done , order ) {
    var sql = "SELECT * FROM " + tableName;
    var params = [];

    if( order != null) {
        sql = sql + " ORDER BY $1";
        params.push(order);
    }


    DBHelper.query(sql, params,
        function (results) {
            done( results);
        },
        function (error) {
            console.log(error);
            done( null );
        });
};

DBHelper.isInt = function(value) {
    return !isNaN(value) && 
        parseInt(Number(value)) == value && 
        !isNaN(parseInt(value, 10));
};


module.exports = DBHelper;