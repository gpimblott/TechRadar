/**
 * This is a stand-alone application that inserts base data into the database
 * 
 * It assumes that the database has already been dreated
 */

// Load in the environment variables
require('dotenv').config({path:'process.env'});

var pg = require('pg');
var async = require('async');

var client = new pg.Client(process.env.DATABASE_URL);
client.connect();


var hpassword = require('crypto').createHash('sha256').update('letmein').digest('base64');

var statements = [
    "DELETE FROM comments",
    "DELETE FROM votes",
    "DELETE FROM technologies",
    "DELETE FROM users",
    "DELETE FROM projects",

    "INSERT INTO categories (name, description) VALUES"+
            " ('Development Tools', 'A program that software developers use to create, debug, maintain, or otherwise support other programs and applications'),"+
            " ('Languages and Frameworks', 'Languages and high-level libraries for developing application and systems'),"+
            " ('Platforms', 'A platform is a group of technologies that are used as a base upon which other applications, processes or technologies are developed.'),"+
            " ('Infrastructure',"+
                " 'The set of hardware, software, networks, facilities, etc., in order to develop, test, deliver, monitor, control or support IT services'),"+
            " ('Testing Tools', 'Tools and libraries that support testing of systems and infrastructure'),"+
            " ('Security Tools', 'Specialist tools and libraries to support the securing of infrastructure and applications')",

    "INSERT INTO roles (id, name, admin) VALUES (0, 'admin', true)",
    "INSERT INTO roles (id, name, admin) VALUES (1, 'user', false)",

    "INSERT INTO status (id, name) VALUES  (0, 'TBD'), (1, 'Adopt'), (2, 'Trial'), (3, 'Discuss'), (4, 'Avoid')",

    "INSERT INTO technologies ( name , description , category ) VALUES ('Java Core' , 'Its java ok we all know about it' , 2 )",
    "INSERT INTO technologies ( name , description , category ) VALUES ('Drop Wizard' , 'REST Services ok' , 2 )",
    "INSERT INTO technologies ( name , description , category ) VALUES ('Hadoop' , 'BIG Data' , 2)",
    "INSERT INTO technologies ( name , description , category ) VALUES ('Ember' , 'Javascript library' , 2)",
    "INSERT INTO technologies ( name , description , category ) VALUES ('Spring Boot' , 'Its spring but easy' , 2)",
    "INSERT INTO technologies ( name , description , category ) VALUES ('On Hold Tech' , 'Something thats on hold' , 2)",


    "INSERT INTO technologies ( name , description , category ) VALUES ('Docker' , 'Hipster container tech' , 1 )",
    "INSERT INTO technologies ( name , description , category ) VALUES ('Mochito' , 'Java mocking library for testing' , 1)",
    "INSERT INTO technologies ( name , description , category ) VALUES ('Git' , 'Code management/repository' , 1)",
    "INSERT INTO technologies ( name , description , category ) VALUES ('Liquibase' , 'Database management' , 1)",

    "INSERT INTO technologies ( name , description , category ) VALUES ('Kubernetes' , 'Hipster container management tech' , 3 )",
    "INSERT INTO technologies ( name , description , category ) VALUES ('RHEL 7' , 'Enterprise grade Linux' , 3 )",
    "INSERT INTO technologies ( name , description , category ) VALUES ('AWS' , 'Infrastructure as a Service' , 3 )",
    "INSERT INTO technologies ( name , description , category ) VALUES ('Java EE' , 'The big bad bits of java' , 3 )",


    "INSERT INTO users (username , password , displayName , role ) VALUES ('admin' , '" + hpassword + "' , 'The Admin', 0) ",
    "INSERT INTO users (username , password , displayName , role ) VALUES ('user1' , '" + hpassword + "' , 'User One', 0) ",
    "INSERT INTO users (username , password , displayName , role ) VALUES ('user2' , '" + hpassword + "' , 'User Two', 0) ",
    "INSERT INTO users (username , password , displayName , role ) VALUES ('user3' , '" + hpassword + "' , 'User Three', 0) ",
    "INSERT INTO users (username , password , displayName , role ) VALUES ('user4' , '" + hpassword + "' , 'User Four', 1) "

];

function doQuery(item, callback) {
    console.log("Query:" + item);
    client.query(item, function (err, result) {
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
