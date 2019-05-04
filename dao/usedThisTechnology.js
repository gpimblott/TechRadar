"use strict";

const dbHelper = require('../utils/dbhelper.js');

const UsedThisTech = function () {
};

/**
 * Get all possible options to choose from: "today", "a week ago", etc.
 * results also contain an integer field "daysAgo"
 * @param done Function to call with the results
 */
UsedThisTech.getAllOptions = function (done) {
    const sql = "SELECT * from used_this_technology_options";

    dbHelper.query(sql, null,
        function (results) {
            done(results);
        },
        function (error) {
            console.log(error);
            done(null);
        });
};

/**
 *
 * @param techId
 * @param daysAgo
 * @param done
 */
UsedThisTech.getUsersCountInLastDays = function (techId, daysAgo, done) {
    const params = [techId];
    let sql = "SELECT COUNT(*) FROM used_this_technology WHERE technology=$1";

    if(daysAgo !== undefined && dbHelper.isInt(daysAgo)) {
        // can't use $2 param here, daysAgo is guaranteed to be an integer
        sql += " AND date > current_date - interval '" + daysAgo + "'  day";
    }

    dbHelper.query(sql, params,
        function (results) {
            done(results);
        },
        function (error) {
            console.log(error);
            done(null);
    });
};

/**
 * Get users that used the technology along with dates of last use
 * @param techId ID of the technology
 * @param limit Maximum number of results to return (undefined || null==all)
 * @param done Function to call with the results
 */
UsedThisTech.getUsersForTechnology = function (techId, limit, done) {
    let sql = "SELECT to_char(used.date, 'DD/MM/YY') as date,t.name as technology, u.username, u.email, u.displayname" +
        " FROM used_this_technology used" +
        " INNER JOIN technologies t on used.technology=t.id " +
        " INNER JOIN users u on used.userid=u.id " +
        " WHERE used.technology=$1" +
        " ORDER BY used.date desc";


    const params = [techId];
    if (limit != null && limit !== "undefined") {
        sql += " limit $2";
        params.push(limit);
    }

    dbHelper.query(sql, params,
        function (results) {
            done(results);
        },
        function (error) {
            console.log(error);
            done(null);
        });
};

/**
 * Add a new used_this_technology vote
 * PostgreSQL doesn't have an upsert until 9.5 so do a delete then insert for now
 * @param technology ID of technology
 * @param daysAgo How many days ago the technology was used
 * @param userId ID if the user voting
 * @param done Function called when complete
 */
UsedThisTech.add = function (technology, daysAgo, userId, done) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    dbHelper.query("SELECT id FROM used_this_technology WHERE technology=$1 and userid=$2", [technology, userId],
        function (selectResult) {
            if (selectResult[0] !== undefined && selectResult[0].id !== undefined) {

                const id = selectResult[0].id;

                dbHelper.query("UPDATE used_this_technology set date=$1 where id=$2", [date, id],

                    function (updateResult) {
                        done(id, null);
                    },
                    function (error) {
                        done(null, error);
                    });
            } else {
                dbHelper.insert("INSERT INTO used_this_technology ( technology, date, userid ) values ($1, $2, $3) returning id",
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
};


module.exports = UsedThisTech;