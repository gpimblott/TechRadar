var dbp = require('./db.js');
var pg = require('pg');
var pgp = require('pg-promise')({
    // Initialization Options
});

var cn = 'postgres://' + dbp.pg.username +':' + dbp.pg.password + '@' + dbp.pg.host + ':' + dbp.pg.port + '/' + dbp.pg.dbname;

console.log(cn);

cn += "?ssl=true";

var db = pgp(cn);


db.tx(function () {

        var t1 = this.none('CREATE TABLE IF NOT EXISTS categories(id SERIAL PRIMARY KEY, name VARCHAR(40) not null )');
        var t2 = this.none('CREATE TABLE IF NOT EXISTS entries(id SERIAL PRIMARY KEY, name VARCHAR(40) not null, text TEXT , '+
            'category integer references categories(id))');
        var t3 = this.none('CREATE TABLE IF NOT EXISTS history(id SERIAL PRIMARY KEY, entry integer references entries(id) )');

        return this.batch([ t1,t2,t3 ]);
    })
    .then(function (data) {
        console.log("done:" + data);
    })
    .catch(function (error) {
        console.log(error); // print error;
    });