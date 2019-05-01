/**
 * Helper function to perform base database operations (e.g. query, insert)
 */
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})


const DBHelper = function () {
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

    //pg.defaults.poolSize=50;
    //console.log("query:" + sql);
    pool.connect(  (err, client, pdone) => {

        // Handle connection errors
        if (err) {
            if (client) {
                client.release();
                pdone();
            }
            error(err);
            return;
        }
        
        client.query(sql, parameters , (err,res)=> {
            pdone();
            done( res.rows );
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

    pool.connect( function (err, client, pdone) {
        // Handle connection errors
        if (err) {
            if (client) {
                client.release();
            }
            error(err);
            return;
        }

        client.query(sql, parameters, (err, result) => {
            pdone();
                if (err) {
                    error(err)
                } else {
                    client.release();
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

    let params = [];
    for (let i = 1; i <= ids.length; i++) {
        params.push('$' + i);
    }

    let sql = "DELETE FROM " + tableName + " WHERE id IN (" + params.join(',') + "  )";
    
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
    let sql = "SELECT * FROM " + tableName;
    let params = [];

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

DBHelper.isInt = function(value) {
    return !isNaN(value) && 
        parseInt(Number(value)) == value && 
        !isNaN(parseInt(value, 10));
}


module.exports = DBHelper;