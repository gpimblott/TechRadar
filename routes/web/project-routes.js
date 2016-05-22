var projects = require('../../dao/projects');
var technology = require('../../dao/technology');
var security = require('../../utils/security.js');

var ProjectRoutes = function () {
};


ProjectRoutes.createRoutes = function (self) {


    /**
     * Show project radar page
     */
    self.app.get('/project/:projectId', security.isAuthenticated,
        function (req, res) {
            projects.findById(req.params.projectId, function (error, project) {

                if (error) {
                    res.render('pages/error', {user: req.user});
                } else {
                    technology.getAllForProject(project.id, function (error, technologies) {
                        if (error) {
                            res.render('pages/error', {user: req.user});
                        } else {
                            res.render('pages/projectRadar', {
                                user: req.user,
                                project: project,
                                technologies: technologies
                            });
                        }
                    });
                }
            });

        });

    /**
     * List projects page
     */
    self.app.get('/projects', security.isAuthenticatedAdmin,
        function (req, res) {
            res.render('pages/admin/listProjects', {user: req.user});
        });

    /**
     * Add new project page
     */
    self.app.get('/project/add', security.isAuthenticatedAdmin,
        function (req, res) {
            res.render('pages/admin/addProject', {user: req.user});
        });

    /**
     * Edit project page
     */
    self.app.get('/project/:projectId/edit', security.isAuthenticatedAdmin,
        function (req, res) {
            projects.findById(req.params.projectId, function (error, project) {
                if (error) {
                    res.render('pages/error', {user: req.user});
                } else {
                    res.render('pages/admin/editProject', {user: req.user, project: project});
                }
            });

        });
}


module.exports = ProjectRoutes;