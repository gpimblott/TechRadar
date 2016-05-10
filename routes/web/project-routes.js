var users = require('../../dao/users');
var security = require('../../utils/security.js');

var ProjectRoutes = function () {
};


ProjectRoutes.createRoutes = function (self) {

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
}


module.exports = ProjectRoutes;