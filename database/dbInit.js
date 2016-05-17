/**
 * This is a stand alone application that creates the database tables
 * 
 * Note: If the tables exists they will be droped
 */

// Load in the environment variables
require('dotenv').config({path: 'process.env'});


var pg = require('pg');
var async = require('async');

console.log(process.env.DATABASE_URL);  

var client = new pg.Client(process.env.DATABASE_URL);
client.connect();

var statements = [
    'DROP TABLE IF EXISTS tech_status_link',
    'DROP TABLE IF EXISTS technology_stack_link',
    'DROP TABLE IF EXISTS technology_project_link',
    'DROP TABLE IF EXISTS history;',
    'DROP TABLE IF EXISTS projects CASCADE',
    'DROP TABLE IF EXISTS comments',
    'DROP TABLE IF EXISTS votes',
    'DROP TABLE IF EXISTS technologies CASCADE',
    'DROP TABLE IF EXISTS stacks',
    'DROP TABLE IF EXISTS categories',
    'DROP TABLE IF EXISTS status',
    'DROP TABLE IF EXISTS users',
    'DROP TABLE IF EXISTS roles',

    'CREATE TABLE IF NOT EXISTS roles(' +
                'id SERIAL PRIMARY KEY, name VARCHAR(15) not null, admin boolean default false )',

    'CREATE TABLE IF NOT EXISTS users(' +
                'id SERIAL PRIMARY KEY, username VARCHAR(15) not null, ' +
                'password VARCHAR(100) not null, displayName VARCHAR(40), ' +
                'role integer references roles(id), ' +
                'avatar VARCHAR(200) )',

    'CREATE TABLE IF NOT EXISTS categories(' +
                'id SERIAL PRIMARY KEY, name VARCHAR(40) not null, description TEXT )',

    "CREATE TABLE IF NOT EXISTS status(id SERIAL PRIMARY KEY, name VARCHAR(10)) ",

    'CREATE TABLE IF NOT EXISTS technologies(id SERIAL PRIMARY KEY, ' +
                'name VARCHAR(40) not null, website VARCHAR(100), description TEXT , ' +
                'category integer references categories(id),' +
                'date TIMESTAMP without time zone default (now() at time zone \'utc\') )',


    'CREATE TABLE IF NOT EXISTS projects(id SERIAL PRIMARY KEY, name VARCHAR(100),' +
                'description TEXT  )',


    "CREATE TABLE IF NOT EXISTS comments(" +
            "id SERIAL PRIMARY KEY," +
            "technology integer references technologies(id) ON DELETE CASCADE," +
            "userid integer references users(id) ON DELETE CASCADE , " +
            "text TEXT, date TIMESTAMP without time zone default (now() at time zone 'utc') )",

    "CREATE TABLE IF NOT EXISTS votes(" +
            "id SERIAL PRIMARY KEY," +
            "technology integer references technologies(id) ON DELETE CASCADE," +
            "status INTEGER references status(id) ON DELETE CASCADE," +
            "userid INTEGER references users(id) ON DELETE CASCADE," +
            "UNIQUE( technology,status,userid)," +
            "date TIMESTAMP without time zone default (now() at time zone 'utc') )",

    "CREATE TABLE IF NOT EXISTS tech_status_link( " +
            "id SERIAL PRIMARY KEY," +
            "reason TEXT," +
            "statusid INTEGER references status(id) ON DELETE CASCADE," +
            "userid INTEGER references users(id) ON DELETE CASCADE," +
            "technologyid INTEGER references technologies(id) ON DELETE CASCADE," +
            "date TIMESTAMP without time zone default (now() at time zone 'utc'))",

    'CREATE TABLE IF NOT EXISTS stacks(' +
        'id SERIAL PRIMARY KEY, name VARCHAR(40) not null, description TEXT )',

    'CREATE TABLE IF NOT EXISTS technology_stack_link(' +
        'stack INTEGER references stacks(id) ON DELETE CASCADE, ' +
        'technology INTEGER references technologies(id) ON DELETE CASCADE )',

    'CREATE TABLE IF NOT EXISTS technology_project_link(' +
        'projectid INTEGER references projects(id) ON DELETE CASCADE, ' +
        'technologyid INTEGER references technologies(id) ON DELETE CASCADE )',

    "INSERT INTO roles ( id, name , admin  ) VALUES ( 0 , 'admin' , true ) ",
    "INSERT INTO roles ( id, name , admin  ) VALUES ( 1 , 'user' , false ) ",

    "INSERT INTO status (id , name) VALUES  (0, 'TBD'), (1,'Adopt'),(2,'Trial'),(3,'Discuss') , (4, 'Avoid')",

    "ALTER SEQUENCE categories_id_seq RESTART WITH 1",
    "INSERT INTO categories (name, description) VALUES " +
                "('Development Tools','A program that software developers use to create, debug, maintain, or otherwise support other programs and applications')," +
                "('Languages and Frameworks','Languages and high-level libraries for developing application and systems')," +
                "('Platforms' , 'A platform is a group of technologies that are used as a base upon which other applications, processes or technologies are developed.')," +
                "('Infrastructure' , " +
                        "'The set of hardware, software, networks, facilities, etc., in order to develop, test, deliver, monitor, control or support IT services'), " +
                "('Testing Tools','Tools and libraries that support testing of systems and infrastructure'), " +
                "('Security Tools' , 'Specialist tools and libraries to support the securing of infrastructure and applications ') "

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
