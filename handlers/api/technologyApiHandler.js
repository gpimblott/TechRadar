var technology = require('../../dao/technology.js');
var status = require('../../dao/status.js');
var votes = require('../../dao/vote.js');
var project = require('../../dao/projects.js');

var apiutils = require('./apiUtils.js');
var sanitizer = require('sanitize-html');
var technologyValidator = require('../../shared/validators/technologyValidator.js');


var TechnologyApiHandler = function () {
};

TechnologyApiHandler.addVote = function (req, res) {
    var tech = sanitizer(req.params.technology);
    var statusValue = sanitizer(req.body.statusvalue);
    var userId = sanitizer(req.user.id);

    votes.add(tech, statusValue, userId, function (result, error) {
        res.writeHead(200, {"Content-Type": "application/json"});
        if (error != null) {
            res.end(JSON.stringify({success: false, error: error}));
        } else {
            res.end(JSON.stringify({success: true, vote: result}));
        }
    });
};

TechnologyApiHandler.getTechnologies = function (req, res) {

    var search = req.query.search;

    if (search == null) {

        technology.getAll(function (result) {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(result));
        })

    } else {

        technology.search(sanitizer(search), function (result) {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(result));
        })
    }
};


TechnologyApiHandler.addTechnology = function (req, res) {
    var technologyName = sanitizer(req.body.technologyName);
    var technologyWebsite = sanitizer(req.body.technologyWebsite);

    var validationResult = technologyValidator.validateTechnologyName(technologyName);
    validateResult = validationResult.valid ? technologyValidator.validateTechnologyWebsite(technologyWebsite) : validationResult;
    
    if (!validationResult.valid) {
        res.writeHead(200, {"Content-Type": "application/json"});
        var data = {};
        data.error = validationResult.message;
        data.success = false;
        res.end(JSON.stringify(data));
        return;
    }
    
    
    technology.add(
        sanitizer(req.body.technologyName),
        sanitizer(req.body.technologyWebsite),
        sanitizer(req.body.technologyCategory),
        sanitizer(req.body.technologyDescription),
        function (result, error) {
            apiutils.handleResultSet(res, result, error);
        });
};

TechnologyApiHandler.updateTechnology = function (req, res) {
    var techid = sanitizer(req.params.technology);

    technology.update(
        techid,
        sanitizer(req.body.name),
        sanitizer(req.body.website),
        sanitizer(req.body.category),
        sanitizer(req.body.description),

        function (result, error) {
            apiutils.handleResultSet(res, result, error);
        });
};

TechnologyApiHandler.deleteTechnology = function (req, res) {
    var data = req.body.id;

    technology.delete(data, function (result, error) {
        apiutils.handleResultSet(res, result, error);
    })
};


TechnologyApiHandler.getVotes = function (req, res) {
    var techid = sanitizer(req.params.technology);
    var limit = sanitizer(req.query.limit);

    votes.getVotesForTechnology(techid, limit, function (result) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    });
};

TechnologyApiHandler.getStatusHistory = function (req, res) {
    var tech = sanitizer(req.params.technology);
    var limit = sanitizer(req.query.limit);

    status.getHistoryForTechnology(tech, limit, function (result) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    })

};

TechnologyApiHandler.getVoteHistory = function (req, res) {
    var tech = sanitizer(req.params.technology);
    var limit = sanitizer(req.query.limit);

    votes.getVotesForTechnology(tech, limit, function (result) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    })
};

TechnologyApiHandler.getVoteTotals = function (req, res) {
    var tech = sanitizer(req.params.technology);
    votes.getTotalVotesForTechnologyStatus(tech, function (result) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    })

};

TechnologyApiHandler.updateStatus = function (req, res) {
    var status = sanitizer(req.body.statusvalue);
    var reason = sanitizer(req.body.reason);
    var tech = sanitizer(req.params.technology);

    technology.updateStatus(tech, status, reason, req.user.id, function (result, error) {
        apiutils.handleResultSet(res, result, error);
    })
};

TechnologyApiHandler.addProject = function (req, res) {
    var projectId = sanitizer(req.body.project);
    var technologyId = sanitizer(req.params.technology);

    technology.addProject(technologyId, projectId, function (result, error) {
        apiutils.handleResultSet(res, result, error);
    })
};

TechnologyApiHandler.getProjects = function (req, res) {
    var technologyId = sanitizer(req.params.technology);

    project.getAllForTechnology(technologyId, function (result, error) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    });
};

TechnologyApiHandler.removeProject = function (req, res) {
    var technologyId = sanitizer(req.params.technology);
    var projectIds = req.body.projects;

    technology.removeProjects(technologyId, projectIds, function (result, error) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    });
};


module.exports = TechnologyApiHandler;
