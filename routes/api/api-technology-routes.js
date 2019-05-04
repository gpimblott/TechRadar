"use strict";

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const security = require('../../utils/security.js');
const handler = require('../../handlers/api/technologyApiHandler.js');

const ApiTechnologyRoutes = function () {
};

ApiTechnologyRoutes.createRoutes = function (self) {

    /**
     * Add a vote for a technology
     */
    self.app.post('/api/technology/:technology/vote', security.canAddComments, jsonParser, handler.addVote);

    /**
     * Add a vote for "I've used this technology"
     */
    self.app.post('/api/technology/:technology/usedThisTechnology', security.canAddComments, jsonParser, handler.addUsedThisTechnologyVote);

    /**
     * Get users who used this technology 
     */
    self.app.get('/api/technology/:technology/users', security.isAuthenticated, jsonParser, handler.getUsers);

    /**
     * Get the number of users who used this technology
     * uses an optional param ?daysAgo=integer 
     * which limits the count to any given number of days 
     */
    self.app.get('/api/technology/:technology/usersCount', security.isAuthenticated, jsonParser, handler.getUsersCountInLastDays);

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
    self.app.post('/api/technology/:technology/status', security.isAuthenticatedAdmin, jsonParser, handler.updateStatus );

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

};

module.exports = ApiTechnologyRoutes;