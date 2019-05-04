"use strict";

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const security = require('../../utils/security.js');
const handler = require('../../handlers/api/softwareVersionsApiHandler.js');

const ApiSoftwareVersionsRoutes = function () {
};

ApiSoftwareVersionsRoutes.createRoutes = function (self) {

    /**
     * Get all versions for technology 
     */
    self.app.get('/api/technology/:technology/versions', security.isAuthenticated, handler.getAllVersionsForTechnology);

    /**
     * Add a new software version and assign it to a technology
     */
    self.app.post('/api/versions', security.canEdit, jsonParser, handler.addVersion);

    /**
     * Delete software versions
     */
    self.app.delete('/api/versions', security.canEdit, jsonParser, handler.deleteVersions);

    /**
     * Update software versions
     */
    self.app.put('/api/versions', security.canEdit, jsonParser, handler.updateVersion);

}

module.exports = ApiSoftwareVersionsRoutes;