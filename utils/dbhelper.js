/**
 * Helper function to perform base database operations (e.g. query, insert)
 */
var pg = require('pg');


var DBHelper = function () {
};


/**
 * Perform a select query operation
 * @param sql Statement to perform
 * @param parameters Parameters for the query
 * @param done Function to call on success
 * @param error Function to call on error
 */
DBHelper.query = function (sql, parameters, done, error) {
    if (process.env.USE_SSL && process.env.USE_SSL.toLowerCase() !== 'false') {
        pg.defaults.ssl = true;
    }

    pg.defaults.poolSize=50;

    //console.log("query:" + sql);
    pg.connect(process.env.DATABASE_URL, function (err, client) {
        var results = [];

        // Handle connection errors
        if (err) {
            if (client) {
                client.end();
            }
            error(err);
            return;
        }
        
        var query = client.query(sql, parameters);

        query.on('row', function (row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function () {
            client.end();
            done(results);
        });

    });
}

/**
 * Perform an insert operation on the database
 * @param sql Statement to perform
 * @param parameters Parameters for the query
 * @param done Function to call on exit
 * @param error Error function to call on error
 */
DBHelper.insert = function (sql, parameters, done, error) {
    if (process.env.USE_SSL && process.env.USE_SSL.toLowerCase() !== 'false') {
        pg.defaults.ssl = true;
    }

    pg.connect(process.env.DATABASE_URL, function (err, client) {
        // Handle connection errors
        if (err) {
            if (client) {
                client.end();
            }
            error(err);
            return;
        }

        client.query(sql, parameters,
            function (err, result) {
                if (err) {
                    error(err)
                } else {
                    client.end();
                    done(result);
                }
            });
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
    
}

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
}


module.exports = DBHelper;