"use strict";

const projects = require('../../dao/projects');
const technology = require('../../dao/technology');

const apiUtils = require('./apiUtils.js');
const sanitizer = require('sanitize-html');
const projectValidator = require('../../shared/validators/projectValidator.js');

const ProjectsApiHandler = function () {
};


ProjectsApiHandler.getProjects = function (req, res) {

    projects.getAll(function (result) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    });
};


/**
 * Add a new project
 * @param req
 * @param res
 */
ProjectsApiHandler.addProject = function (req, res) {

    const projectName = sanitizer(req.body.projectname);
    const projectDescription = sanitizer(req.body.description);

    const validationResult = projectValidator.validateProjectName(projectName);
    if (!validationResult.valid) {
        res.writeHead(200, {"Content-Type": "application/json"});
        let data = {};
        data.error = validationResult.message;
        data.success = false;
        res.end(JSON.stringify(data));
        return;
    }

    projects.add(
        projectName,
        projectDescription,

        function (result, error) {
            apiUtils.handleResultSet(res, result, error);
        });

};

/**
 * Delete a project
 * @param req
 * @param res
 */
ProjectsApiHandler.deleteProject = function (req, res) {
    const data = req.body.id;

    projects.delete(data, function (result, error) {
        apiUtils.handleResultSet(res, result, error);
    })
};

/**
 * Delete a technology from a project
 * @param req
 * @param res
 */
ProjectsApiHandler.deleteTechnologiesFromProject = function (req, res) {
    const linkIds = req.body.links;

    projects.deleteTechnologies(linkIds, function (result, error) {
        apiUtils.handleResultSet(res, result, error);
    });
};

/**
 * Update a technology version
 * @param req
 * @param res
 */
ProjectsApiHandler.updateTechnologyVersion = function (req, res) {
    const versionId = sanitizer(req.body.version);
    const linkId = sanitizer(req.params.linkId);
    
    req.checkParams('linkId', 'Invalid technology-project link ID').isInt();
    req.checkBody('version', 'Invalid version ID').isInt();

    const errors = req.validationErrors();
    if (errors) {
        res.end(JSON.stringify({success: false, error: errors}));
        return;
    }

    projects.updateTechnologyVersion(versionId, linkId, function (result, error) {
        apiUtils.handleResultSet(res, result, error);
    });
};

ProjectsApiHandler.getTechnologiesForProject = function (req, res) {
    const projectId = sanitizer(req.params.projectId);

    technology.getAllForProject(projectId, function (error, result) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    });
};


ProjectsApiHandler.addTechnologyToProject = function (req, res) {
    const projectId = sanitizer(req.params.projectId);
    const technologyIds = req.body.technologies;
    const versionIds = req.body.versions;

    projects.addTechnologies(projectId, technologyIds, versionIds, function (result, error) {
        apiUtils.handleResultSet(res, result, error);
    });
};


ProjectsApiHandler.updateProject = function (req, res) {
    projects.update(
        req.body.projectId,
        sanitizer(req.body.projectname),
        sanitizer(req.body.description), function (result, error) {
            apiUtils.handleResultSet(res, result, error);
        });

};

module.exports = ProjectsApiHandler;