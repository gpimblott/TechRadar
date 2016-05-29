var cache = require('../../dao/cache');
var projects = require('../../dao/projects');

var DashboardApiHandler = function () {
};

/**
 * Get all categories
 */
DashboardApiHandler.getTechnologyForProject = function (req, res) {
    var projectId = req.params.project;
    
    projects.getTechForProject(function (projectId, result) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    });
};


module.exports = DashboardApiHandler;