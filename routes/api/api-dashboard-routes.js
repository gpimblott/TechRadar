var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var security = require('../../utils/security.js');

var handler = require('../../handlers/api/dashboardApiHandler.js');

var ApiDashboardRoutes = function () {
};

ApiDashboardRoutes.createRoutes = function (self) {

  
    /**
     * Get all votes for all technologies
     */
    self.app.get('/api/dash/votes/technologies', security.isAuthenticated, handler.getVotesForAllTechnologies);

    /**
     * Get the number of votes for each technology where it is differrent to the current status
     */
    self.app.get('/api/dash/votes/month', security.isAuthenticated, handler.getVotesDifferentFromStatus);
    
    /**
     * Get the number of projects each technology is used on
     */
    self.app.get('/api/dash/technology/project', security.isAuthenticated, handler.getMostUsedTechnologies);
};

module.exports = ApiDashboardRoutes;