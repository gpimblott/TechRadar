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

    /**
     * Get the number of comments each technology has
     */
    self.app.get('/api/dash/technology/comments', security.isAuthenticated, handler.getCommentsPerTechnology);
    
    /**
     * Get the number of votes cast by each user
     */
    self.app.get('/api/dash/votes/users' , security.isAuthenticated, handler.getVotesPerUserCount);
};

module.exports = ApiDashboardRoutes;