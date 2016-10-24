var cache = require('../../dao/cache');
var projects = require('../../dao/projects');
var technology = require('../../dao/technology');

var apiutils = require('./apiUtils.js');
var sanitizer = require('sanitize-html');
var projectValidator = require('../../shared/validators/projectValidator.js');

var ProjectsApiHandler = function () {
};


ProjectsApiHandler.getProjects = function (req, res) {

    projects.getAll(function (result) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    });
};


ProjectsApiHandler.addProject = function (req, res) {

    var projectName = sanitizer(req.body.projectname);
    var projectDescription = sanitizer(req.body.description);

    var validationResult = projectValidator.validateProjectName(projectName);
    if (!validationResult.valid) {
        res.writeHead(200, {"Content-Type": "application/json"});
        var data = {};
        data.error = validationResult.message;
        data.success = false;
        res.end(JSON.stringify(data));
        return;
    }

    projects.add(
        projectName,
        projectDescription,

        function (result, error) {
            apiutils.handleResultSet(res, result, error);
        });

};


ProjectsApiHandler.deleteProject = function (req, res) {
    var data = req.body.id;

    projects.delete(data, function (result, error) {
        apiutils.handleResultSet(res, result, error);
    })
};

ProjectsApiHandler.deleteTechnologiesFromProject = function (req, res) {
    var linkIds = req.body.links;

    projects.deleteTechnologies(linkIds, function (result, error) {
        apiutils.handleResultSet(res, result, error);
    });
};

ProjectsApiHandler.updateTechnologyVersion = function (req, res) {
    var versionId = sanitizer(req.body.version);
    var linkId = sanitizer(req.params.linkId);
    
    req.checkParams('linkId', 'Invalid technology-project link ID').isInt();
    req.checkBody('version', 'Invalid version ID').isInt();

    var errors = req.validationErrors();
    if (errors) {
        res.end(JSON.stringify({success: false, error: errors}));
        return;
    }

    projects.updateTechnologyVersion(versionId, linkId, function (result, error) {
        apiutils.handleResultSet(res, result, error);
    });
};

ProjectsApiHandler.getTechnologiesForProject = function (req, res) {
    var projectId = sanitizer(req.params.projectId);

    technology.getAllForProject(projectId, function (error, result) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    });
};


ProjectsApiHandler.addTechnologyToProject = function (req, res) {
    var projectId = sanitizer(req.params.projectId);
    var technologyIds = req.body.technologies;
    var versionIds = req.body.versions;

    projects.addTechnologies(projectId, technologyIds, versionIds, function (result, error) {
        apiutils.handleResultSet(res, result, error);
    });
};


ProjectsApiHandler.updateProject = function (req, res) {
    projects.update(
        req.body.projectId,
        sanitizer(req.body.projectname),
        sanitizer(req.body.description), function (result, error) {
            apiutils.handleResultSet(res, result, error);
        });

};

module.exports = ProjectsApiHandler;