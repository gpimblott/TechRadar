"use strict";

const projects = require('../../dao/projects');
const votes = require('../../dao/vote');
const technologies = require('../../dao/technology');
const comments = require('../../dao/comments');

const sanitizer = require('sanitize-html');

const DashboardApiHandler = function () {
};

/**
 * Get the technologies used by a project
 * @param req
 * @param res
 */
DashboardApiHandler.getTechnologyForProject = function (req, res) {
    const projectId = req.params.project;

    projects.getTechForProject(projectId,function (projectId, result) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    });
};

DashboardApiHandler.getVotesForAllTechnologies = function (req, res) {
    votes.getVotesForAllTechnologies(function (result) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    })
};

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
    const limit = sanitizer(req.query.limit);
    technologies.getTechnologiesWithUserCounts(limit, function (result, error) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    });
};



module.exports = DashboardApiHandler;