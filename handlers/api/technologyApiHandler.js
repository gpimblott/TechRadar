var technology = require('../../dao/technology');
var status = require('../../dao/status');
var votes = require('../../dao/vote');
var usedThisVotes = require('../../dao/usedThisTechnology');
var project = require('../../dao/projects');
var cache = require('../../dao/cache');

var apiutils = require('./apiUtils');
var sanitizer = require('sanitize-html');
var technologyValidator = require('../../shared/validators/technologyValidator');


var TechnologyApiHandler = function () {
};

TechnologyApiHandler.addVote = function (req, res) {
    var tech = sanitizer(req.params.technology);
    var statusName = sanitizer(req.body.statusname);
    var userId = sanitizer(req.user.id);

    var status = cache.getStatus( statusName );
    var statusValue = status.id;

    votes.add(tech, statusValue, userId, function (result, error) {
        res.writeHead(200, {"Content-Type": "application/json"});
        if (error != null) {
            res.end(JSON.stringify({success: false, error: error}));
        } else {
            res.end(JSON.stringify({success: true, vote: result}));
        }
    });
};

TechnologyApiHandler.addUsedThisTechnologyVote = function (req, res) {
    var tech = sanitizer(req.params.technology);
    var daysAgo = sanitizer(req.body.daysAgo);
    var userId = sanitizer(req.user.id);

    usedThisVotes.add(tech, daysAgo, userId, function (result, error) {
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
        technology.getAll(req.user.id, function (result) {
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
    var technologyLicenceLink = sanitizer(req.body.technologyLicenceLink);

    var validationResult = technologyValidator.validateTechnologyName(technologyName);
    validationResult = validationResult.valid ? technologyValidator.validateTechnologyWebsite(technologyWebsite) : validationResult;
    validationResult = validationResult.valid ? technologyValidator.validateTechnologyLicenceWebsite(technologyLicenceLink) : validationResult;
    
    if (!validationResult.valid) {
        res.writeHead(200, {"Content-Type": "application/json"});
        var data = {};
        data.error = validationResult.message;
        data.success = false;
        res.end(JSON.stringify(data));
        return;
    }

    technology.add(
        technologyName,
        technologyWebsite,
        sanitizer(req.body.technologyCategory),
        sanitizer(req.body.technologyDescription),
        sanitizer(req.body.technologyLicence),
        technologyLicenceLink,
        function (result, error) {
            apiutils.handleResultSet(res, result, error);
        });
};

TechnologyApiHandler.updateTechnology = function (req, res) {
    var techid = sanitizer(req.params.technology);

    var technologyName = sanitizer(req.body.name);
    var technologyWebsite = sanitizer(req.body.website);
    var technologyLicenceLink = sanitizer(req.body.technologyLicenceLink);

    var validationResult = technologyValidator.validateTechnologyName(technologyName);
    validationResult = validationResult.valid ? technologyValidator.validateTechnologyWebsite(technologyWebsite) : validationResult;
    validationResult = validationResult.valid ? technologyValidator.validateTechnologyLicenceWebsite(technologyLicenceLink) : validationResult;

    if (!validationResult.valid) {
        res.writeHead(200, {"Content-Type": "application/json"});
        var data = {};
        data.error = validationResult.message;
        data.success = false;
        res.end(JSON.stringify(data));
        return;
    }
    
    technology.update(
        techid,
        sanitizer(technologyName),
        sanitizer(technologyWebsite),
        sanitizer(req.body.category),
        sanitizer(req.body.description),
        sanitizer(req.body.technologyLicence),
        technologyLicenceLink,

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

TechnologyApiHandler.getUsers = function (req, res) {
    var technologyId = sanitizer(req.params.technology);
    var limit; // getUsersForTechnology can handle undefined limit
    if(typeof req.query.limit != "undefined"){
        limit = sanitizer(req.query.limit);
    }

    usedThisVotes.getUsersForTechnology(technologyId, limit, function (result, error) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    });
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
