var db = require('../config/dbConfig.js');
var pg = require('pg');


var Category = function () {};


Category.getAllValues = function ( done ) {
    /**
     * Create the list of earthquakes for the front page
     */
    pg.defaults.ssl = true;
    pg.connect(db.getConnectionString() , function (err, client ) {
        var results = [];

        // Handle connection errors
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({ success: false, data: err});
        }

        var sql = "SELECT * FROM categories " ;
        var query = client.query( sql );

        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done(results);
            client.end();
        });

    });
}

module.exports = Category;