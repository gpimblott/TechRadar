var pg = require('pg');
var dbhelper = require('../utils/dbhelper.js');

var Projects = function () {
};

/**
 * Get all the projects
 * @param done function to call with the results
 */
Projects.getAll = function (done) {
    dbhelper.getAllFromTable("PROJECTS", done);
}

/**
 * Get a project by ID
 * @param id ID of the project to get
 * @param done Function to call with the result
 */
Projects.findById = function (id, done) {
    var sql = "SELECT *" +
        " FROM projects " +
        " where projects.id=$1 ";

    dbhelper.query(sql, [id],
        function (results) {
            if (results.length == 0) {
                done(true, null);
            } else {
                done(null, results[0]);
            }
        },
        function (error) {
            console.log(error);
            return done(error, null);
        });
};


/**
 * Add multiple technologies to a project
 *
 * @param projectId Project ID
 * @param technologyIds Array of Technology IDs
 * @param callback Function to call when the update is finished
 */
Projects.addTechnologies = function (projectId, technologyIds, callback) {
    var sql = "INSERT INTO technology_project_link (technologyid, projectid) VALUES ";

    var numRows = technologyIds.length;
    for (var i = 1; i <= numRows; i++) {
        sql += " ( $" + i + "," + projectId + ")";
        if (i != numRows) {
            sql += ",";
        }
    }

    var params = technologyIds;

    dbhelper.insert(sql, params,
        function (result) {
            callback(result);
        },
        function (error) {
            console.log(error);
            callback(null, error);
        });
};

/**
 * Delete a set of technologies using their ID numbers
 * @param ids
 * @param done
 */
Projects.deleteTechnologies = function (projectid, ids, done) {

    var params = [];
    for (var i = 1; i <= ids.length; i++) {
        params.push('$' + i);
    }

    var sql = "DELETE FROM technology_project_link WHERE technologyid IN (" + params.join(',') + " ) and projectid=" + projectid;

    dbhelper.query(sql, ids,
        function (result) {
            done(true);
        },
        function (error) {
            console.log(error);
            done(false, error);
        });
}

/**
 * Add a new project
 * @param name Name of the project to add
 * @done function to call with the result
 */
Projects.add = function (name, description, done) {
    var sql = "INSERT INTO projects ( name, description ) values ( $1 , $2 ) returning id";

    dbhelper.insert(sql, [name, description],
        function (result) {
            done(result.rows[0].id);
        },
        function (error) {
            console.log(error);
            done(null, error);
        });
}

/**
 * Delete a set of projects using their ID numbers
 * @param ids
 * @param done
 */
Projects.delete = function (ids, done) {
    dbhelper.deleteByIds("PROJECTS", ids, done);
}

/**
 * Update project data
 */
Projects.update = function (id, name, description, done) {
    var sql = "UPDATE projects SET name=$1, description=$2 where id=$3";

    dbhelper.query(sql, [name, description, id],
        function (result) {
            done(result);
        },
        function (error) {
            console.log(error);
            done(false, error);
        });
};

/**
 * Get all projects linked to a given technology
 *
 * @technologyId ID of the technology to get the projects for
 * @param done function to call with the results
 */
Projects.getAllForTechnology = function (technologyId, done) {
    var sql = "SELECT p.* from projects p" +
        " INNER JOIN technology_project_link tpl on p.id = tpl.projectid" +
        " where tpl.technologyid = $1" +
        " ORDER BY p.name ASC";

    dbhelper.query(sql, [technologyId],
        function (result) {
            done(result);
        },
        function (error) {
            console.log(error);
            done(null, error);
        });
};

/**
 * Get all of the technologies used by each project
 */
Projects.getTechForProject = function (id, done) {
    var sql = "SELECT p.name as project, t.name as technology FROM technology_project_link tpl" +
        " JOIN projects p on tpl.projectid=p.id" +
        " JOIN technologies t on tpl.technologyid=t.id" +
        " WHERE p.id=$1";

    dbhelper.query(sql, [id],
        function (result) {
            done(result);
        },
        function (error) {
            console.log(error);
            done(null, error);
        });
}

module.exports = Projects;