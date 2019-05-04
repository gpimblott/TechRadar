"use strict";

const handler = require('../../handlers/web/technologiesWebHandler');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const security = require('../../utils/security.js');

const TechnologyRoutes = function () {
};


TechnologyRoutes.createRoutes = function (self) {

    /**
     * Show the technology search page
     */
    self.app.get('/technology/search', security.isAuthenticated, jsonParser, handler.search );

    /**
     * Add a new technology
     */
    self.app.get('/technology/add', security.canEdit, handler.add );

    /**
     * Edit a technology
     */
    self.app.get('/technology/:id/edit', security.canEdit, handler.edit );

    /**
     * Edit the software versions for a technology 
     */
    self.app.get('/technology/:id/versions', security.canEdit, handler.getVersions );

    /**
     * Show the status history for a technology
     */
    self.app.get('/technology/:id/statushistory', security.isAuthenticated, handler.getStatusHistory );

    /**
     * Show the vote history for a technology
     */
    self.app.get('/technology/:id/votehistory', security.isAuthenticated,  handler.getVotes );

    /**
     * Show all of the status updates for a technology
     */
    self.app.get('/technology/:id/updatestatus', security.isAuthenticatedAdmin, handler.updateStatus );

    /**
     * Show the projects for a specified technology
     */
    self.app.get('/technology/:id/projects', security.isAuthenticated, handler.addProject );

    /**
     * Show the users of a specified technology
     */
    self.app.get('/technology/:id/users', security.isAuthenticated, handler.getUsers );

    /**
     * Show a specific technology by id
     */
    self.app.get('/technology/:id', security.isAuthenticated, handler.getTechnology );

    /**
     * List all the technologies
     */
    self.app.get('/technologies', security.isAuthenticatedAdmin,  handler.listTechnologies );

};

module.exports = TechnologyRoutes;