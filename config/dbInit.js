var dbp = require('./dbConfig.js');
var pg = require('pg');
var async = require('async');

var client = new pg.Client(dbp.getConnectionString());
client.connect();

var statements = [
    'DROP TABLE IF EXISTS project_tech_link',
    'DROP TABLE IF EXISTS tech_status_link',
    'DROP TABLE IF EXISTS history;',
    'DROP TABLE IF EXISTS projects',
    'DROP TABLE IF EXISTS comments',
    'DROP TABLE IF EXISTS votes',
    'DROP TABLE IF EXISTS technologies',
    'DROP TABLE IF EXISTS categories',
    'DROP TABLE IF EXISTS status',
    'DROP TABLE IF EXISTS users',
    'DROP TABLE IF EXISTS roles',

    'CREATE TABLE IF NOT EXISTS roles(id SERIAL PRIMARY KEY, name VARCHAR(15) not null, admin boolean default false )',
    'CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, username VARCHAR(15) not null, ' +
                'password VARCHAR(15) not null, displayName VARCHAR(40), role integer references roles(id) )',
    'CREATE TABLE IF NOT EXISTS categories(id SERIAL PRIMARY KEY, name VARCHAR(40) not null, description TEXT )',
    "CREATE TABLE IF NOT EXISTS status(id SERIAL PRIMARY KEY, name VARCHAR(10)) ",
    'CREATE TABLE IF NOT EXISTS technologies(id SERIAL PRIMARY KEY, name VARCHAR(40) not null, website VARCHAR(100), description TEXT , ' +
            'category integer references categories(id) )',
    'CREATE TABLE IF NOT EXISTS history(id SERIAL PRIMARY KEY, technology integer references technologies(id) )',
    'CREATE TABLE IF NOT EXISTS projects(id SERIAL PRIMARY KEY, name VARCHAR(100) )',
    'CREATE TABLE IF NOT EXISTS project_tech_link(project integer references projects(id), technology integer references technologies(id)  )',
    "CREATE TABLE IF NOT EXISTS comments(id SERIAL PRIMARY KEY, technology integer references technologies(id), userid integer references users(id) , " +
            "text TEXT, date TIMESTAMP without time zone default (now() at time zone 'utc') )",
    "CREATE TABLE IF NOT EXISTS votes(id SERIAL PRIMARY KEY, technology integer references technologies(id) ," +
            " status INTEGER references status(id) , userid INTEGER references users(id), UNIQUE( technology,status,userid)," +
            " date TIMESTAMP without time zone default (now() at time zone 'utc') )",

    "CREATE TABLE IF NOT EXISTS tech_status_link( id SERIAL PRIMARY KEY, statusid INTEGER references status(id) , userid INTEGER references users(id)," +
            "technologyid INTEGER references technologies(id)," +
            "date TIMESTAMP without time zone default (now() at time zone 'utc'))",

    "INSERT INTO roles ( id, name , admin  ) VALUES ( 0 , 'admin' , true ) ",
    "INSERT INTO roles ( name , admin  ) VALUES ('user' , false ) ",

    "INSERT INTO status (id , name) VALUES  (0, 'TBD'), (1,'Adopt'),(2,'Trial'),(3,'Assess'), (4,'Hold') , (5, 'Avoid')",
    "INSERT INTO categories (id , name, description) VALUES " +
                "(1,'Tools','A program that software developers use to create, debug, maintain, or otherwise support other programs and applications')," +
                "(2,'Languages and Frameworks','Languages and highlevel libraries for building application and systems')," +
                "(3,'Platforms' , 'A platform is a group of technologies that are used as a base upon which other applications, processes or technologies are developed.')," +
                "(4,'Infrastructure' , 'The set of hardware, software, networks, facilities, etc., in order to develop, test, deliver, monitor, control or support IT services') ",

    ];


function doQuery(item, callback) {
    console.log("Query:" + item);
    client.query(item, function (err, result) {
        // return any err to async.each iterator
        callback(err);
    })
}

async.eachSeries(statements, doQuery, function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log("All Done");
        client.end();
    }

});
