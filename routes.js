var pg = require('pg');
var db = require('./config/db.js');


var Routes = function () {
};


Routes.create = function (app) {

    /**
     * Home page with no parameters
     */
    app.get('/', function (req, res) {
        res.render('pages/index', {});
    });


    app.get('/db', function (req, res) {

        pg.defaults.ssl = true;
        pg.connect(process.env.DATABASE_URL, function(err, client) {
            if (err) throw err;
            console.log('Connected to postgres! Getting schemas...');

            client.query('SELECT table_schema,table_name FROM information_schema.tables;')
                .on('row', function(row) {
                    console.log(JSON.stringify(row));
                    //res.send( JSON.stringify(row));
                });
        });

        res.send("Hello world 2");
    });
}

module.exports = Routes;
