var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var security = require('../../utils/security.js');

var handler = require('../../handlers/api/dashboardApiHandler.js');

var ApiDashboardRoutes = function () {
};

ApiDashboardRoutes.createRoutes = function (self) {

    /**
     * Get all technology for all projects
     */
    self.app.get('/api/projects/technologies', security.isAuthenticated, handler.getTechnologyForProject );

    /**
     * Get all votes for all technologies
     */
    self.app.get('/api/dash/votes/technologies', security.isAuthenticated, handler.getVotesForAllTechnologies );

};

module.exports = ApiDashboardRoutes;