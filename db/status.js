var db = require('../config/dbConfig.js');
var pg = require('pg');


var Status = function () {
};


Status.getValues = function ( done ) {
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


        var query = client.query("SELECT * FROM status ORDER BY id ASC");

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

module.exports = Status;