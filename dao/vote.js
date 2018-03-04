var pg = require('pg');
var dbhelper = require('../utils/dbhelper.js');


var Vote = function () {
};

/**
 * Get all the votes for a technology
 * @param techid ID of the technology
 * @param limit Maximum number of results to return (null==all)
 * @param done Function to call with the results
 */
Vote.getVotesForTechnology = function (techid, limit, done) {
    var sql = "SELECT to_char(v.date, 'DD/MM/YY') as date,t.name as technology,s.name as status, u.username " +
        " FROM votes v" +
        " INNER JOIN technologies t on v.technology=t.id " +
        " INNER JOIN status s on v.status=s.id " +
        " INNER JOIN users u on v.userid=u.id " +
        " WHERE v.technology=$1" +
        " ORDER BY v.date desc";


    var params = [techid];
    if (limit != null) {
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

/**
 * Get a count of votes in the last month for each technology where the vots is different to the current status
 * @param done
 */
Vote.getVotesInLastMonthDifferentFromStatus = function (done) {
    var sql = "SELECT t.name as name, v.status AS status_id, count(t.id) as total " +
        "FROM votes v " +
        "JOIN technologies t on v.technology=t.id " +
        "LEFT JOIN tech_status_link tsl on v.technology=tsl.technologyid " +
        "WHERE " +
        "(" +
        "(tsl.date = (select max(date) from tech_status_link tsl2 where tsl.technologyid=tsl2.technologyid) " +
        "and v.status!=coalesce(tsl.statusid,0) ) " +
        "OR tsl.technologyid IS NULL" +
        ") " +
        "AND " +
        "( v.date between (now()-INTERVAL '3 MONTH') and now() ) " +
        "GROUP BY t.id, t.name, v.status";
    
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
 * Get the number of votes for each status for each technology
 * @param techid ID of technology
 * @param done Function to call with the results
 */
Vote.getTotalVotesForTechnologyStatus = function (techid, done) {
    var sql = "SELECT technologies.name as Technology, status.name as status, COUNT(status.name) AS count " +
        " FROM votes " +
        " INNER JOIN technologies on technologies.id=votes.technology " +
        " INNER JOIN status on status.id=votes.status " +
        " GROUP BY technologies.name,votes.technology, status.name " +
        " HAVING votes.technology=$1 " +
        " ORDER BY technologies.name, count desc";
    
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
 * Get the number of votes for all technologies.  This is used by the dashboard
 * @param done Function to call with the results
 */
Vote.getVotesForAllTechnologies = function (done) {
    var sql = "SELECT count(v.id), s.name as status, t.name as technology" +
        " FROM votes v" +
        " LEFT JOIN technologies t on t.id=v.technology" +
        " LEFT JOIN status s on s.id=v.status" +
        " GROUP BY t.id, s.id" +
        " ORDER BY t.name,s.name;";
    
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
 * Get the number of votes for all technologies.  This is used by the dashboard
 * @param done Function to call with the results
 */
Vote.getVotesForAllTechnologies = function (done) {
    var sql = "SELECT count(v.id), s.name as status, t.name as technology" +
        " FROM votes v" +
        " LEFT JOIN technologies t on t.id=v.technology" +
        " LEFT JOIN status s on s.id=v.status" +
        " GROUP BY t.id, s.id" +
        " ORDER BY t.name,s.name;";

    dbhelper.query(sql, [],
        function (results) {
            done(results);
        },
        function (error) {
            console.log(error);
            done(null);
        });

}/**
 * Get the number of votes for all technologies.  This is used by the dashboard
 * @param done Function to call with the results
 */
Vote.getVotesPerUserCount = function (done) {
    var sql = "SELECT u.username username, count(v.id) total " +
        "FROM votes v " +
        "JOIN users u ON v.userid=u.id " +
        "GROUP BY username " +
        "ORDER BY total desc limit 10";

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
 * Add a vote for a technology
 * PostgreSQL doesn't have an upsert until 9.5 so do a delete then insert for now
 * @param technology ID of technology
 * @param status ID of status
 * @param userid ID if the user voting
 * @param done Function called when complete
 */
Vote.add = function (technology, status, userid, done) {


    dbhelper.query("SELECT id FROM votes WHERE technology=$1 and userid=$2", [technology, userid],
        function (selectResult) {

            if (selectResult[0] != undefined && selectResult[0].id != undefined) {

                var id = selectResult[0].id;

                dbhelper.query("UPDATE votes set status=$1,date=now() where id=$2", [status, id],

                    function (updateResult) {
                        done(id, null);
                    },
                    function (error) {
                        done(null, error);
                    });
            } else {

                dbhelper.insert("INSERT INTO votes ( technology, status, userid ) values ($1, $2, $3) returning id",
                    [technology, status, userid],

                    function (insertResult) {
                        done(insertResult.rows[0].id, null);
                    },
                    function (error) {
                        done(null, error);
                    });
            }

        },
        function (error) {
            done(null, error);
        });
}

module.exports = Vote;