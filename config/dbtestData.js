var dbp = require('./dbConfig.js');
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

// (1,'DVSA')
// (2,'ONS')
// (3,'Home Office')
// (4,'DVLA')
// (5,'DEFRA')
// (6,'MoJ')


var statements = [
    "DELETE FROM comments",
    "DELETE FROM votes",
    "DELETE FROM technologies",
    "INSERT INTO technologies ( name , description , category, status ) VALUES ('Java Core' , 'Its java ok we all know about it' , 2,1)",
    "INSERT INTO technologies ( name , description , category, status ) VALUES ('Scala' , 'Its like java but with hipster syntax' , 2,1)",
    "INSERT INTO technologies ( name , description , category, status ) VALUES ('Drop Wizard' , 'REST Services ok' , 2,1)",
    "INSERT INTO technologies ( name , description , category, status ) VALUES ('Hadoop' , 'Its java ok we all know about it' , 2,2)",
    "INSERT INTO technologies ( name , description , category, status ) VALUES ('Ember' , 'Its java ok we all know about it' , 2,3)",
    "INSERT INTO technologies ( name , description , category, status ) VALUES ('Spring Boot' , 'Its spring but easy' , 2,3)",
    "INSERT INTO technologies ( name , description , category, status ) VALUES ('On Hold Tech' , 'Something thats on hold' , 2,4)",


    "INSERT INTO technologies ( name , description , category, status ) VALUES ('Docker' , 'Hipster container tech' , 1,3)",
    "INSERT INTO technologies ( name , description , category, status ) VALUES ('Mochito' , 'Java mocking library for testing' , 1,1)",
    "INSERT INTO technologies ( name , description , category, status ) VALUES ('Git' , 'Code management/repository' , 1,1)",
    "INSERT INTO technologies ( name , description , category, status ) VALUES ('Liquibase' , 'Database management' , 1,1)",

    "INSERT INTO technologies ( name , description , category, status ) VALUES ('Kubernetes' , 'Hipster container management tech' , 3,3)",
    "INSERT INTO technologies ( name , description , category, status ) VALUES ('RHEL 7' , 'Java mocking library for testing' , 3,1)",
    "INSERT INTO technologies ( name , description , category, status ) VALUES ('AWS' , 'IaaS' , 3,1)",
    "INSERT INTO technologies ( name , description , category, status ) VALUES ('Java EE' , 'The big bad bits of java' , 3,6)",


];

function doQuery(item, callback) {
    console.log("Query:" + item);
    client.query(item, function (err, result) {
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
