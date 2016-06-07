var handler = require('../../handlers/web/projectsWebHandler');
var security = require('../../utils/security.js');

var ProjectRoutes = function () {
};


ProjectRoutes.createRoutes = function (self) {

    /**
     * Add new project page
     */
    self.app.get('/project/add', security.canEdit, handler.add);
    
    /**
     * Edit project page
     */
    self.app.get('/project/:projectId/edit', security.isAuthenticatedAdmin, handler.edit);

    /**
     * Show project radar page
     */
    self.app.get('/project/:projectId', security.isAuthenticated, handler.showRadar);

    /**
     * List projects page
     */
    self.app.get('/projects', security.isAuthenticated, handler.list );


}


module.exports = ProjectRoutes;