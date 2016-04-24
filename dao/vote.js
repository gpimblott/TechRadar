var pg = require('pg');
var dbhelper = require('../utils/dbhelper.js');


var Vote = function () {
};


Vote.getVotesForTechnology = function (techid , limit, done) {
    var sql = "SELECT to_char(v.date, 'DD/MM/YY') as date,t.name as technology,s.name as status, u.username " +
                " FROM votes v" +
                " INNER JOIN technologies t on v.technology=t.id " +
                " INNER JOIN status s on v.status=s.id " +
                " INNER JOIN users u on v.userid=u.id " +
                " WHERE v.technology=$1" +
                " ORDER BY v.date desc";
    
    
    var params = [techid];
    if( limit !=null ) {
        sql += " limit $2";
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


Vote.getTotalVotesForTechnology = function (techid, done) {
    var sql = "SELECT technologies.name as Technology, status.name as status, COUNT(status.name) AS count " +
        " FROM votes " +
        " INNER JOIN technologies on technologies.id=votes.technology " +
        " INNER JOIN status on status.id=votes.status " +
        " GROUP BY technologies.name,votes.technology, status.name " +
        " HAVING votes.technology=$1 " +
        " ORDER BY technologies.name, status.name";

    dbhelper.query(sql, [techid],
        function (results) {
            done(results);
        },
        function (error) {
            console.log(error);
            done(null);
        });
}

/**
 * Add a new technology
 */
Vote.add = function (technology, status, userid, done ) {
    var sql = "INSERT INTO votes ( technology, status, userid ) values ($1, $2, $3) returning id";
    var params = [ technology, status, userid ];

    dbhelper.insert( sql, params ,
        function( result ) {
            done( result.rows[0].id , null);
        },
        function(error) {
            done( null , error );
        } );
}

module.exports = Vote;