var pg = require('pg');
var dbhelper = require('../utils/dbhelper.js');


var Status = function () {
};

/**
 * Get all the Status values
 * @param done Function to call with the results
 */
Status.getAll = function (done) {
    var sql = "SELECT * FROM status ORDER BY id ASC";

    dbhelper.query(sql, [],
        function (results) {
            done(results);
        },
        function (error) {
            console.log(error);
            done(null);
        });
}

/**
 * Get the history of status changes for the specified technology
 * @param technologyid ID of the technology to get history for
 * @param limit The maximum number of results to return (or null for all)
 * @param done Function to call with results
 */
Status.getHistoryForTechnology = function( technologyid , limit, done)
{
    var sql = "SELECT s.name, tsl.reason as reason , u.username, to_char(tsl.date, 'DD/MM/YY') as date  " +
        " FROM tech_status_link tsl" +
        " JOIN STATUS s on tsl.statusid=s.id " +
            " JOIN users u on u.id=tsl.userid" + 
        " WHERE tsl.technologyid=$1" +
        " ORDER BY tsl.date DESC";


    var params = [technologyid];

    if( null !=limit ) {
        sql += " LIMIT $2";
        params.push(limit);
    }

    dbhelper.query(sql, params,
        function (results) {
            done(results);
        },
        function (error) {
            console.log(error);
            done(null);
        });
}

module.exports = Status;