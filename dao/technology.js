var pg = require('pg');
var dbhelper = require('../utils/dbhelper.js');


var Technology = function () {
};


/**
 * Add a new technology
 * @param name Name of the technology
 * @param website Website for the technology
 * @param category Category ID for the technology
 * @param description Textual description of the technology
 * @param licence Type of licence
 * @param licencelink Link to more licence info
 * @param done Function to call when stored
 * @returns ID of the row created
 */
Technology.add = function (name, website, category, description, licence, licencelink,  done) {
    var sql = "INSERT INTO technologies ( name , website, category , description, licence, licencelink ) values ($1, $2, $3, $4, $5, $6 ) returning id";
    var params = [name, website, category, description, licence, licencelink];

    dbhelper.insert(sql, params,
        function (result) {
            done(result.rows[0].id);
        },
        function (error) {
            console.log(error);
            done(null, error);
        });
};

/**
 * Add a new technology
 * @param id ID of the technology
 * @param name Name of the technology
 * @param website Website for the technology
 * @param category Category ID for the technology
 * @param description Textual description of the technology
 * @param licence Type of licence
 * @param licencelink Link to more licence info
 * @param done Function to call when stored
 * @returns true/false
 */
Technology.update = function (id, name, website, category, description, licence, licencelink, done) {
    var sql = "UPDATE technologies SET name=$1 , website=$2, category=$3, description=$4, licence=$6, licencelink=$7 where id=$5";
    var params = [name, website, category, description, id, licence, licencelink];


    dbhelper.insert(sql, params,
        function (result) {
            done(true);
        },
        function (error) {
            console.error(error);
            done(false, error);
        });
};

/**
 * Delete a set of technologies using their ID numbers
 * @param ids
 * @param done
 */
Technology.delete = function (ids, done) {

    var params = [];
    for (var i = 1; i <= ids.length; i++) {
        params.push('$' + i);
    }

    var sql = "DELETE FROM TECHNOLOGIES WHERE id IN (" + params.join(',') + "  )";

    dbhelper.query(sql, ids,
        function (result) {
            done(true);
        },
        function (error) {
            console.error(error);
            done(false, error);
        });
};

/**
 * Update the status for a technology
 * @param technology Technology ID
 * @param status Status ID
 * @param reason Reason for the change
 * @param userid UserID making the change
 * @param done Function to call when the update is finished
 */
Technology.updateStatus = function (technology, status, reason, userid, done) {
    var sql = "INSERT INTO tech_status_link ( technologyid ,statusid , userid , reason ) VALUES ( $1 , $2 , $3 , $4) returning id";
    var params = [technology, status, userid, reason];

    dbhelper.insert(sql, params,
        function (result) {
            done(result.rows[0].id);
        },
        function (error) {
            console.error(error);
            done(null, error);
        });
};

/**
 * Get a specific technology using its ID
 * @param userid id of the user performing the query
 * @param id ID of the technology
 * @param done Function to call with the results
 */
Technology.getById = function (userid, id, done) {
    var sql = "SELECT t.* ,s.name as statusName, s.id as status, c.name as categoryName," +
        " COALESCE( " +
            "(select s2.name from votes v " +
            "JOIN STATUS s2 on s2.id=v.status WHERE userid=$1 AND technology=t.id order by date desc limit 1), " +
            "'TBD') as vote" +
        " FROM technologies t " +
        " INNER JOIN categories c on t.category=c.id " +
        " LEFT OUTER JOIN status s on s.id = " +
        "    COALESCE( (select statusid from tech_status_link where technologyid=t.id order by date desc limit 1),0 )" +
        " where t.id=$2";
    
    var params = [userid, id];
    dbhelper.query(sql, params ,
        function (results) {
            if (results.length != 1) {
                done(null);
            } else {
                done(results[0]);
            }
        },
        function (error) {
            console.error(error);
            done(null);
        });
};

/**
 * Get all technologies
 * @param done Function to call with the results
 */
Technology.getAll = function (userid, done) {
    var sql = "SELECT t.id, t.name as name, t.website as website, t.description, t.licence, t.licencelink, " +
        "s.name as status, c.name as category, " +
        "COALESCE( " +
        "(select s2.name from votes v " +
        "join status s2 on s2.id=v.status where userid=$1 and technology=t.id order by date desc limit 1), " +
        "'TBD') as vote" +
        " FROM technologies t" +
        " INNER JOIN categories c on t.category=c.id" +
        " LEFT OUTER JOIN status s on s.id = " +
        "    COALESCE( (select statusid from tech_status_link where technologyid=t.id order by date desc limit 1),0 )";


    dbhelper.query(sql, [userid],
        function (results) {
            done(results);
        },
        function (error) {
            console.error(error);
            done(null, error);
        });
};

/**
 * Selects technologies with names, category IDs, status IDs and the number of users
 * @param {integer} [limit=40] Maximum number of records to return (max: 40)
 */
Technology.getTechnologiesWithUserCounts = function (limit, done) {
    if (!(limit > 0) && !(limit < 40)) {
        limit = 40;
    }
    var params = [limit];
    var sql = `
        SELECT t.name, t.category, s.id AS status_id, COUNT(used.*) 
            FROM technologies AS t
        INNER JOIN used_this_technology used
            ON used.technology=t.id
        LEFT OUTER JOIN status s on s.id =
            COALESCE( (select statusid from tech_status_link 
                WHERE technologyid=t.id
                ORDER BY date DESC LIMIT 1),0)
        GROUP BY t.id, s.id
        ORDER BY count DESC
        LIMIT $1`;

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
 * Get all of the technologies in a category
 * @param cname Name of the category
 * @param done Function to call with the results
 */
Technology.getAllForCategory = function (cname, done) {

    var sql = "SELECT row_number() over (order by s) as num, t.id, t.name as name, t.website as website, t.description, " +
        "t.licence, t.licencelink, s.name as status, c.name as category " +
        " FROM technologies t" +
        " INNER JOIN categories c on t.category=c.id" +
        " LEFT OUTER JOIN status s on s.id = " +
        "    COALESCE( (select statusid from tech_status_link where technologyid=t.id order by date desc limit 1),0 )" +
        " WHERE LOWER(c.name)=$1" +
        " ORDER BY status, t.name ASC";


    dbhelper.query(sql, [cname],
        function (results) {
            done(results);
        },
        function (error) {
            console.error(error);
            done(null);
        });
};

/**
 * Get all of the technologies for a given project
 * @param id ID of the project
 * @param done Function to call with the results
 */
Technology.getAllForProject = function (id, done) {
    var sql = "SELECT row_number() over (order by s) AS num,t.*," + 
        " s.name as status, ver.id AS versionid, ver.name AS version, tpl.id AS linkid" +
        " FROM technologies t" +
        " INNER JOIN technology_project_link tpl on t.id=tpl.technologyid" +
        " LEFT OUTER JOIN software_versions ver on ver.id=tpl.software_version_id" +
        " INNER JOIN projects p on p.id=tpl.projectid" +
        " LEFT OUTER JOIN status s on s.id = " +
        "    COALESCE( (select statusid from tech_status_link where technologyid=t.id order by date desc limit 1),0 )" +
        " WHERE p.id=$1" +
        " ORDER BY status, t.name ASC;";

    dbhelper.query(sql, [id],
        function (results) {
            done(null, results);
        },
        function (error) {
            console.error(error);
            done(error, null);
        });
};

/**
 * Search for technologies
 * @param value String to search for
 * @param done Function to call with the results
 */
Technology.search = function (value, done) {

    var sql =
        "SELECT t.id, t.name as name, t.website as website, t.description, t.licence, t.licencelink, " +
        "s.name as status, c.name as category " +
        " FROM technologies t" +
        " INNER JOIN categories c on t.category=c.id" +
        " LEFT OUTER JOIN status s on s.id = " +
        "    COALESCE( (select statusid from tech_status_link where technologyid=t.id order by date desc limit 1),0 )" +
        " WHERE technologies.name ILIKE $1 AND tsl2.id IS NULL";

    dbhelper.query(sql, ['%' + value + '%'],
        function (results) {
            done(results);
        },
        function (error) {
            console.error(error);
            done(null);
        });
};

/**
 * Add a project to a technology
 *
 * @param technologyId Technology ID
 * @param projectId Project ID
 * @param callback Function to call when the update is finished
 */
Technology.addProject = function (technologyId, projectId, done) {
    var sql = "INSERT INTO technology_project_link (technologyid, projectid) VALUES ($1, $2)";
    var params = [technologyId, projectId];

    dbhelper.insert(sql, params,
        function (result) {
            done(result);
        },
        function (error) {
            console.error(error);
            done(null, error);
        });
};


/**
 * Remove projects from a technology
 *
 * @param technologyId Technology ID
 * @param projectIds Project IDs
 * @param callback Function to call when the deletion is finished
 */
Technology.removeProjects = function (technologyId, projectIds, done) {
    var idPlaceholders = [];
    for (var i = 2; i <= projectIds.length + 1; i++) {
        idPlaceholders.push('$' + i);
    }

    var sql = "DELETE FROM technology_project_link" +
        " WHERE technologyid = $1 " +
        " and projectid IN (" + idPlaceholders.join(',') + ")";

    var params = [technologyId];
    params = params.concat(projectIds);

    dbhelper.query(sql, params,
        function (result) {
            done(true);
        },
        function (error) {
            console.error(error);
            done(false, error);
        });
};

Technology.getMostUsedTechnologies = function ( done ) {
    var sql = `SELECT t.name, count(technologyid) as total, s.id AS status_id 
            FROM technology_project_link tpl 
            JOIN technologies t on tpl.technologyid=t.id 
            -- status_id is used by dashboard graphs
            LEFT OUTER JOIN status s on s.id =
                COALESCE( (select statusid from tech_status_link 
                    WHERE technologyid=t.id
                    ORDER BY date DESC LIMIT 1),0)
            GROUP BY t.name, s.id
            ORDER BY total DESC 
            LIMIT 40`;

    dbhelper.query(sql, [],
        function (results) {
            done(results);
        },
        function (error) {
            console.error(error);
            done(null);
        });
};

module.exports = Technology;