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
 * Get a project by it's name
 * @param name Name of the project to get
 * @param done Function to call with the result
 */
Projects.findByName = function (name, done) {
    var sql = "SELECT *" +
        " FROM projects " +
        " where lower(projects.name)=lower($1) ";

    dbhelper.query(sql, [name],
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
 * @param softwareVersionIds Array of Version IDs - its indexes(placement) should correspond to those in technologyIds
 * @param callback Function to call when the update is finished
 */
Projects.addTechnologies = function (projectId, technologyIds, softwareVersionIds, callback) {
    var sql = "INSERT INTO technology_project_link (technologyid, projectid, software_version_id) VALUES ";

    var numRows = technologyIds.length;
    for (var i = 0; i < numRows; i++) {
        var optionalVersionId = getOptionalVersionId(softwareVersionIds[i]);
        sql += " ( $" + (i+1) + "," + projectId + optionalVersionId + ")";
        if (i != numRows - 1) {
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
Projects.deleteTechnologies = function (ids, done) {

    var params = [];
    for (var i = 1; i <= ids.length; i++) {
        params.push('$' + i);
    }

    var sql = "DELETE FROM technology_project_link WHERE id IN (" + params.join(',') + " )";

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
 * Changes the version assigned to a technology used in a project
 * @param versionId corresponds to the software_version_id column
 * @param linkId id of a technology_project_link record
 * @param done 
 */
Projects.updateTechnologyVersion = function (versionId, linkId, done) {

    var params = [versionId, linkId];
    var sql = `UPDATE technology_project_link SET software_version_id =
    	COALESCE(
            (SELECT $1::integer WHERE NOT EXISTS (SELECT 1 FROM technology_project_link WHERE software_version_id = $1 AND projectid =
                -- look for duplicates only in the same project
                (SELECT projectid FROM technology_project_link WHERE id=$2))),
            -- use the original value if the nested SELECT finds a duplicate 
            software_version_id)
        WHERE id=$2`;

    dbhelper.query(sql, params,
        function (result) {
            done(result)
        },
        function (error) {
            console.log(error);
            done(false, error);
        })
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

/**
 * Checks whether versionId can be used in an SQL query,
 * if not - replaces the value with a null
 * @param {string} versionId - value that will be verified 
 * @returns ", null" or ", {integer}"
 */
function getOptionalVersionId(versionId) {
    var optionalVersionId = ", null";
    if(dbhelper.isInt(versionId)) {
        optionalVersionId = "," + versionId;
    }
    return optionalVersionId;
}

module.exports = Projects;