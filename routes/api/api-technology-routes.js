var technology = require('../../dao/technology.js');
var status = require('../../dao/status.js');
var votes = require('../../dao/vote.js');
var project = require('../../dao/projects.js');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var passport = require('passport');
var security = require('../../utils/security.js');

var apiutils = require('./apiUtils.js');

var sanitizer = require('sanitize-html');

var handler = require('../../handlers/api/technologyApiHandler.js');

var ApiTechnologyRoutes = function () {
};

ApiTechnologyRoutes.createRoutes = function (self) {

    /**
     * Add a vote for a technology
     */
    self.app.post('/api/technology/:technology/vote', security.canAddComments, jsonParser, handler.addVote);

    /**
     * Get all technologies
     */
    self.app.get('/api/technology', security.isAuthenticated, jsonParser, handler.getTechnologies);


    /**
     * Add a new technology
     */
    self.app.post('/api/technology', security.canEdit, jsonParser, handler.addTechnology);

    /**
     * Update a technology
     */
    self.app.put('/api/technology/:technology', security.canEdit, jsonParser, handler.updateTechnology);

    /**
     * Delete technologies
     */
    self.app.delete('/api/technology', security.canEdit, jsonParser, handler.deleteTechnology );

    /**
     * Get all votes for a technology
     */
    self.app.get('/api/votes/:technology', security.isAuthenticated, handler.getVotes );

    /**
     * Get the status history of a technology
     */
    self.app.get('/api/technology/:technology/status/history', security.isAuthenticated, jsonParser, handler.getStatusHistory );

    /**
     * Get the vote history for a technology
     */
    self.app.get('/api/technology/:technology/vote/history', security.isAuthenticated, jsonParser, handler.getVoteHistory );

    /**
     * Get the votes for a technology
     */
    self.app.get('/api/technology/:technology/vote/totals', security.isAuthenticated, jsonParser, handler.getVoteTotals );

    /**
     * Update the status of a technology
     */
    self.app.post('/api/technology/:technology/status', security.canEdit, jsonParser, handler.updateStatus );

    /**
     * Add a project to a technology
     */
    self.app.post('/api/technology/:technology/project', security.canEdit, jsonParser, handler.addProject );

    /**
     * Get linked Projects
     */
    self.app.get('/api/technology/:technology/projects', security.isAuthenticated, jsonParser, handler.getProjects );

    /**
     * Remove links to Projects
     */
    self.app.delete('/api/technology/:technology/projects', security.canEdit, jsonParser, handler.removeProject );

}

module.exports = ApiTechnologyRoutes;