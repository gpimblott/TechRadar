"use strict";

const dbHelper = require('../utils/dbhelper.js');

const Projects = function () {
};

/**
 * Get all the projects
 * @param done function to call with the results
 */
Projects.getAll = function (done) {
    dbHelper.getAllFromTable("PROJECTS", done);
};

/**
 * Get a project by ID
 * @param id ID of the project to get
 * @param done Function to call with the result
 */
Projects.findById = function (id, done) {
    const sql = "SELECT * FROM projects where projects.id=$1";

    dbHelper.query(sql, [id],
        function (results) {
            if (results.length === 0) {
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
    const sql = "SELECT * FROM projects where lower(projects.name)=lower($1) ";

    dbHelper.query(sql, [name],
        function (results) {
            if (results.length === 0) {
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
    let sql = "INSERT INTO technology_project_link (technologyid, projectid, software_version_id) VALUES ";

    const numRows = technologyIds.length;
    for (let i = 0; i < numRows; i++) {
        const optionalVersionId = getOptionalVersionId(softwareVersionIds[i]);
        sql += " ( $" + (i+1) + "," + projectId + optionalVersionId + ")";
        if (i !== numRows - 1) {
            sql += ",";
        }
    }

    dbHelper.insert(sql, technologyIds,
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

    let params = [];
    for (let i = 1; i <= ids.length; i++) {
        params.push('$' + i);
    }

    const sql = "DELETE FROM technology_project_link WHERE id IN (" + params.join(',') + " )";

    dbHelper.query(sql, ids,
        function (result) {
            done(true);
        },
        function (error) {
            console.log(error);
            done(false, error);
        });
};

/**
 * Changes the version assigned to a technology used in a project
 * @param versionId corresponds to the software_version_id column
 * @param linkId id of a technology_project_link record
 * @param done 
 */
Projects.updateTechnologyVersion = function (versionId, linkId, done) {

    const params = [versionId, linkId];
    const sql = `UPDATE technology_project_link SET software_version_id =
    	COALESCE(
            (SELECT $1::integer WHERE NOT EXISTS (SELECT 1 FROM technology_project_link WHERE software_version_id = $1 AND projectid =
                -- look for duplicates only in the same project
                (SELECT projectid FROM technology_project_link WHERE id=$2))),
            -- use the original value if the nested SELECT finds a duplicate 
            software_version_id)
        WHERE id=$2`;

    dbHelper.query(sql, params,
        function (result) {
            done(result)
        },
        function (error) {
            console.log(error);
            done(false, error);
        })
};

/**
 * Add a new project
 * @param name Name of the project to add
 * @param description Description of the project
 * @param done Function to call when we have the result
 * @done function to call with the result
 */
Projects.add = function (name, description, done) {
    const sql = "INSERT INTO projects ( name, description ) values ( $1 , $2 ) returning id";

    dbHelper.insert(sql, [name, description],
        function (result) {
            done(result.rows[0].id);
        },
        function (error) {
            console.log(error);
            done(null, error);
        });
};

/**
 * Delete a set of projects using their ID numbers
 * @param ids
 * @param done
 */
Projects.delete = function (ids, done) {
    dbHelper.deleteByIds("PROJECTS", ids, done);
};

/**
 * Update project data
 */
Projects.update = function (id, name, description, done) {
    const sql = "UPDATE projects SET name=$1, description=$2 where id=$3";

    dbHelper.query(sql, [name, description, id],
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
 * @param technologyId ID of the project to search for
 * @param done function to call with the results
 */
Projects.getAllForTechnology = function (technologyId, done) {
    const sql = "SELECT p.* from projects p" +
        " INNER JOIN technology_project_link tpl on p.id = tpl.projectid" +
        " where tpl.technologyid = $1" +
        " ORDER BY p.name ASC";

    dbHelper.query(sql, [technologyId],
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
    const sql = "SELECT p.name as project, t.name as technology FROM technology_project_link tpl" +
        " JOIN projects p on tpl.projectid=p.id" +
        " JOIN technologies t on tpl.technologyid=t.id" +
        " WHERE p.id=$1";

    dbHelper.query(sql, [id],
        function (result) {
            done(result);
        },
        function (error) {
            console.log(error);
            done(null, error);
        });
};

/**
 * Checks whether versionId can be used in an SQL query,
 * if not - replaces the value with a null
 * @param {string} versionId - value that will be verified 
 * @returns ", null" or ", {integer}"
 */
function getOptionalVersionId(versionId) {
    let optionalVersionId = ", null";
    if(dbHelper.isInt(versionId)) {
        optionalVersionId = "," + versionId;
    }
    return optionalVersionId;
}

module.exports = Projects;