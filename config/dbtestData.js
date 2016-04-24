// Load in the environment variables
require('dotenv').config({path: 'process.env'});

var pg = require('pg');
var async = require('async');

var client = new pg.Client(dbp.getConnectionString());
client.connect();

// (1,'Adopt')
// (2,'Trial')
// (3,'Assess')
// (4,'Hold')
// (5,'Avoid')
// (6, 'Hold')

// (1,'Tools')
// (2,'Languages and Frameworks')
// (3,'Platforms')
// (4,'Infrastructure')



var statements = [
    "DELETE FROM comments",
    "DELETE FROM votes",
    "DELETE FROM technologies",
    "DELETE FROM users",
    "DELETE FROM projects",


    "INSERT INTO technologies ( name , description , category ) VALUES ('Java Core' , 'Its java ok we all know about it' , 2 )",
    "INSERT INTO technologies ( name , description , category ) VALUES ('Scala' , 'Its like java but with hipster syntax' , 2 )",
    "INSERT INTO technologies ( name , description , category ) VALUES ('Drop Wizard' , 'REST Services ok' , 2 )",
    "INSERT INTO technologies ( name , description , category ) VALUES ('Hadoop' , 'Its java ok we all know about it' , 2)",
    "INSERT INTO technologies ( name , description , category ) VALUES ('Ember' , 'Its java ok we all know about it' , 2)",
    "INSERT INTO technologies ( name , description , category ) VALUES ('Spring Boot' , 'Its spring but easy' , 2)",
    "INSERT INTO technologies ( name , description , category ) VALUES ('On Hold Tech' , 'Something thats on hold' , 2)",


    "INSERT INTO technologies ( name , description , category ) VALUES ('Docker' , 'Hipster container tech' , 1 )",
    "INSERT INTO technologies ( name , description , category ) VALUES ('Mochito' , 'Java mocking library for testing' , 1)",
    "INSERT INTO technologies ( name , description , category ) VALUES ('Git' , 'Code management/repository' , 1)",
    "INSERT INTO technologies ( name , description , category ) VALUES ('Liquibase' , 'Database management' , 1)",

    "INSERT INTO technologies ( name , description , category ) VALUES ('Kubernetes' , 'Hipster container management tech' , 3 )",
    "INSERT INTO technologies ( name , description , category ) VALUES ('RHEL 7' , 'Java mocking library for testing' , 3 )",
    "INSERT INTO technologies ( name , description , category ) VALUES ('AWS' , 'IaaS' , 3 )",
    "INSERT INTO technologies ( name , description , category ) VALUES ('Java EE' , 'The big bad bits of java' , 3 )",

 
    "INSERT INTO users (username , password , displayName , role ) VALUES ('gordon' , 'letmein' , 'Gordon Pimblott', 0) ",
    "INSERT INTO users (username , password , displayName , role ) VALUES ('davey' , 'letmein' , 'Davey McGlade', 0) ",
    "INSERT INTO users (username , password , displayName , role ) VALUES ('darren' , 'letmein' , 'Darren Martin', 0) ",
    "INSERT INTO users (username , password , displayName , role ) VALUES ('peter' , 'letmein' , 'Peter Campbell', 0) ",
    "INSERT INTO users (username , password , displayName , role ) VALUES ('rory' , 'letmein' , 'Rory', 0) "

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
