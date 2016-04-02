var dbp = require('./dbConfig.js');
var pg = require('pg');
var async = require('async');

var client = new pg.Client(dbp.getConnectionString());
client.connect();

var statements = [
    'DROP TABLE IF EXISTS project_entry_link',
    'DROP TABLE IF EXISTS history;',
    'DROP TABLE IF EXISTS entries',
    'DROP TABLE IF EXISTS status',
    'DROP TABLE IF EXISTS categories',
    'DROP TABLE IF EXISTS projects',

    'CREATE TABLE IF NOT EXISTS categories(id SERIAL PRIMARY KEY, name VARCHAR(40) not null )',
    'CREATE TABLE IF NOT EXISTS status(id SERIAL PRIMARY KEY, name VARCHAR(10)  )',
    'CREATE TABLE IF NOT EXISTS entries(id SERIAL PRIMARY KEY, name VARCHAR(40) not null, text TEXT , ' +
            'category integer references categories(id) , status integer references status(id))',
    'CREATE TABLE IF NOT EXISTS history(id SERIAL PRIMARY KEY, entry integer references entries(id) )',
    'CREATE TABLE IF NOT EXISTS projects(id SERIAL PRIMARY KEY, name VARCHAR(100) )',
    'CREATE TABLE IF NOT EXISTS project_entry_link(project integer references projects(id), entry integer references entries(id)  )',

    "INSERT INTO status (id , name) VALUES (1,'Adopt'),(2,'Trial'),(3,'Assess'), (4,'Hold') , (5, 'Avoid'), (6, 'TBD')",
    "INSERT INTO categories (id , name) VALUES (1,'Tools'),(2,'Languages and Frameworks'),(3,'Platforms'),(4,'Infrastructure') ",
    "INSERT INTO projects (id , name) VALUES (1, 'DVSA'), (2,'ONS'), (3,'Home Office'), (4,'DVLA'), (5,'DEFRA'), (6,'MoJ') "
    ];


function doQuery(item, callback) {
    console.log("Query:" + item);
    client.query(item, function (err, result) {
        // return any err to async.each iterator
        callback(err);
    })
}

async.eachSeries(statements, doQuery, function (err) {
    // Release the client to the pg module
    if (err) {
        console.error(err);
    } else {
        console.log("All Done");
        client.end();
    }

});
