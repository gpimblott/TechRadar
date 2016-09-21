var pg = require('pg');
var dbhelper = require('../utils/dbhelper.js');

var UsedThisTech = function () {
};

/**
 * Get all possible options to choose from: "today", "a week ago", etc.
 * results also contain an integer field "daysAgo"
 * @param done Function to call with the results
 */
UsedThisTech.getAllOptions = function (done) {
    var sql = "SELECT * from used_this_technology_options";

    dbhelper.query(sql, null,
        function (results) {
            done(results);
        },
        function (error) {
            console.log(error);
            done(null);
        });
}

UsedThisTech.getUsersCountInLastDays = function (techid, daysAgo, done) {
    var params = [techid];
    var sql = "SELECT COUNT(*) FROM used_this_technology WHERE technology=$1";

    if(daysAgo != undefined && isInt(daysAgo)) {
        // can't use $2 param here, daysAgo is guaranteed to be an integer
        sql += " AND date > current_date - interval '" + daysAgo + "'  day";
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
 * Get users that used the technology along with dates of last use
 * @param techid ID of the technology
 * @param limit Maximum number of results to return (undefined || null==all)
 * @param done Function to call with the results
 */
UsedThisTech.getUsersForTechnology = function (techid, limit, done) {
    var sql = "SELECT to_char(used.date, 'DD/MM/YY') as date,t.name as technology, u.username, u.email, u.displayname" +
        " FROM used_this_technology used" +
        " INNER JOIN technologies t on used.technology=t.id " +
        " INNER JOIN users u on used.userid=u.id " +
        " WHERE used.technology=$1" +
        " ORDER BY used.date desc";


    var params = [techid];
    if (limit != null && limit != "undefined") {
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
 * Add a new used_this_technology vote
 * PostgreSQL doesn't have an upsert until 9.5 so do a delete then insert for now
 * @param technology ID of technology
 * @param daysAgo How many days ago the technology was used
 * @param userId ID if the user voting
 * @param done Function called when complete
 */
UsedThisTech.add = function (technology, daysAgo, userId, done) {
    var date = new Date();
    date.setDate(date.getDate() - daysAgo);

    dbhelper.query("SELECT id FROM used_this_technology WHERE technology=$1 and userid=$2", [technology, userId],
        function (selectResult) {
            if (selectResult[0] != undefined && selectResult[0].id != undefined) {

                var id = selectResult[0].id;

                dbhelper.query("UPDATE used_this_technology set date=$1 where id=$2", [date, id],

                    function (updateResult) {
                        done(id, null);
                    },
                    function (error) {
                        done(null, error);
                    });
            } else {
                dbhelper.insert("INSERT INTO used_this_technology ( technology, date, userid ) values ($1, $2, $3) returning id",
                    [technology, date, userId],

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

function isInt(value) {
  return !isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10));
}

module.exports = UsedThisTech;