"use strict";

const dbHelper = require('../utils/dbhelper.js');

const DEFAULT_PAGE_SIZE = 10;

/**
 * Database routines for 'Comments'
 */
const Comments = function () {
};

/**
 * Get a pge of comments for the given technology
 *
 * @param technology ID of the technology to get comments for
 * @param pageNum Page number
 * @param pageSize Max amount of comments to be returned
 * @param done function to call with the results
 */
Comments.getForTechnology = function (technology, pageNum, pageSize, done) {
    const sql = `SELECT comments.*, users.displayName, 
        users.username, users.avatar, software_versions.name AS version
        FROM comments 
        left outer join software_versions on comments.software_version_id=software_versions.id
        inner join users on comments.userid=users.id
        where comments.technology=$1
        order by date desc
        LIMIT $2 OFFSET $3`;

    const limit = pageSize || DEFAULT_PAGE_SIZE;
    const offset = pageNum ? pageNum * limit : 0;

    dbHelper.query(sql, [technology, limit, offset],
        function (results) {
            done(results, null);
        },
        function (error) {
            console.error(error);
            done(null, error);
        });
};

/**
 * Get comment count for the given technology
 *
 * @param technology ID of the technology to get comment count for
 * @param done function to call with the results
 */
Comments.getCountForTechnology = function (technology, done) {
    const sql = "SELECT count(*) FROM comments where technology=$1";

    dbHelper.query(sql, [technology],
        function (results) {
            done(results[0]);
        },
        function (error) {
            console.error(error);
            done(null, error);
        });
};

/**
 * Get the number of comments for each technology
 * @param technology
 * @param done
 */
Comments.getTotalNumberCommentsForTechnologies = function (done) {
    const sql = `select count(*) total, t.name technology, s.id AS status_id
        FROM comments c
        JOIN technologies t on c.technology=t.id 
        -- status_id is used by dashboard graphs
        LEFT OUTER JOIN status s on s.id =
            COALESCE( (select statusid from tech_status_link 
                WHERE technologyid=t.id
                ORDER BY date DESC LIMIT 1),0)
        GROUP BY t.name, s.id 
        ORDER BY total DESC limit 10`;

    dbHelper.query(sql, [],
        function (results) {
            done(results, null);
        },
        function (error) {
            console.error(error);
            done(null, error);
        });
};


/**
 * Add a new comment
 * @param technology Technology ID that the comment should be added to
 * @param text Comment text to add
 * @param userId User ID adding the comment
 * @param done function to call with the results
 */
Comments.add = function (technology, text, userId, software_version_id, done) {
    let versionColumn = "";
    let versionParam = "";
    let params = [technology, text, userId];

    // add the optional software_version_id param if it's not empty
    if(software_version_id != null && software_version_id.length > 0) {
        versionColumn = ", software_version_id";
        versionParam = ", $4";
        params.push(software_version_id);
    }

    const sql = "INSERT INTO comments ( technology , text , userid" + versionColumn + " ) " +
    " VALUES ( $1 , $2 , $3 " + versionParam + " ) RETURNING id";

    dbHelper.insert(sql, params,
        function (result) {
            done(result.rows[0].id);
        },
        function (error) {
            console.error(error);
            done(null, error);
        });
}

/**
 * Delete a set of comments using their ID numbers
 * @param ids
 * @param done
 */
Comments.delete = function (ids, done) {

    let params = [];
    for (let i = 1; i <= ids.length; i++) {
        params.push('$' + i);
    }

    const sql = "DELETE FROM COMMENTS WHERE id IN (" + params.join(',') + "  )";


    dbHelper.query(sql, ids,
        function (result) {
            done(true);
        },
        function (error) {
            console.error(error);
            done(false, error);
        });
}


module.exports = Comments;