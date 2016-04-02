var db = require('../config/dbConfig.js');
var pg = require('pg');


var Entry = function () {
};


Entry.getValues = function ( cname, done ) {
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

        var sql = "SELECT row_number() OVER (ORDER BY status) as num, entries.name as name, status.name as status, categories.name as category "+
                    " FROM entries " +
                    " inner join status on entries.status=status.id " +
                    " inner join categories on entries.category=categories.id " +
                    " where lower(categories.name)='" + cname + "'";

        console.log(sql);
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

module.exports = Entry;