var users = require('../../dao/users');
var security = require('../../utils/security.js');

var UserRoutes = function () {
};


UserRoutes.createRoutes = function (self) {

    /**
     * Users page
     */
    self.app.get('/users', security.isAuthenticatedAdmin,
        function (req, res) {
            res.render('pages/admin/user/listUsers', {user: req.user});
        });


    /**
     * Add new user page
     */
    self.app.get('/user/add', security.isAuthenticatedAdmin,
        function (req, res) {
            res.render('pages/admin/user/addUser', {user: req.user});
        });

    /**
     * Edit profile page
     */
    self.app.get('/profile', security.isAuthenticated,
        function (req, res) {
            res.render('pages/editProfile', {user: req.user, editUser: req.user});
        });

    /**
     * Edit user page
     */
    self.app.get('/user/:userId/edit', security.isAuthenticatedAdmin,
        function (req, res) {
            users.findById(req.params.userId, function (error, editUser) {
                if (error) {
                    res.render('pages/error', {user: req.user});
                } else {
                    res.render('pages/admin/user/editUser', {user: req.user, editUser: editUser});
                }
            });

        });

}


module.exports = UserRoutes;