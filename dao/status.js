var db = require('../config/dbConfig.js');
var pg = require('pg');
var dbhelper = require('../dao/dbhelper.js');


var Status = function () {
};


Status.getValuesForCategory = function (done ) {
    var sql = "SELECT * FROM status ORDER BY id ASC";

    dbhelper.query(sql, [],
        function (results) {
            done(results);
        },
        function (error) {
            console.log(error);
        });
}

module.exports = Status;