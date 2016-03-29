var pg = require('pg');
var dbcfg = require('./config/dbConfig.js');

var status = require('./db/status.js');

var Routes = function () {
};


Routes.create = function (app) {

    /**
     * Home page with no parameters
     */
    app.get('/', function (req, res) {
        res.render('pages/index', {});
    });

    /**
     * Main cateory 'radar' pages
     */
    app.get('/radar/:category', function (req, res) {
      
        status.getValues( function( values ) {
            console.log(values);
            res.render('pages/radar', { category : req.params.category , statuses : values } );
        });
    });


    app.get('/db', function (req, res) {

        pg.defaults.ssl = true;
        pg.connect(dbcfg.getConnectionString(), function (err, client, done) {
            var results = [];

            if (err) throw err;

            console.log('Connected to postgres! Getting schemas...');

            var query = client.query('SELECT table_schema,table_name FROM information_schema.tables;');

            query.on('row', function (row) {
                results.push(row);
            });

            // After all data is returned, close connection and return results
            query.on('end', function () {
                done();
                return res.json(results);
            });
        });

    });


    app.get('/test/:category', function (req, res) {
        console.log('------------------' );
        console.log(req.params.category);

        status.getValues( function( values ) {
            console.log(values);
            res.render('pages/index', { category : req.params.category , statuses : values } );
        });
    });
}

module.exports = Routes;
