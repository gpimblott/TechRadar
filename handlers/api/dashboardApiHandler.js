var cache = require('../../dao/cache');
var projects = require('../../dao/projects');
var votes = require('../../dao/vote');
var technologies = require('../../dao/technology');
var comments = require('../../dao/comments');

var sanitizer = require('sanitize-html');

var DashboardApiHandler = function () {
};

/**
 * Get all
 */
DashboardApiHandler.getTechnologyForProject = function (req, res) {
    var projectId = req.params.project;

    projects.getTechForProject(function (projectId, result) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    });
};

DashboardApiHandler.getVotesForAllTechnologies = function (req, res) {
    votes.getVotesForAllTechnologies(function (result) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    })
}

DashboardApiHandler.getVotesDifferentFromStatus = function (req, res) {
    votes.getVotesInLastMonthDifferentFromStatus(function (result) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    });
};

DashboardApiHandler.getMostUsedTechnologies = function (req,res) {
    technologies.getMostUsedTechnologies(function (result) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    });
};

DashboardApiHandler.getVotesPerUserCount = function (req,res) {
    votes.getVotesPerUserCount(function (result) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    });
};

DashboardApiHandler.getCommentsPerTechnology = function (req,res) {
    comments.getTotalNumberCommentsForTechnologies(function (result) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    });
};

DashboardApiHandler.getTechnologiesWithUsersCount = function (req, res) {
    var limit = sanitizer(req.query.limit);
    technologies.getTechnologiesWithUserCounts(limit, function (result, error) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    });
};



module.exports = DashboardApiHandler;