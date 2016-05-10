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
            res.render('pages/admin/listUsers', {user: req.user});
        });


    /**
     * Add new user page
     */
    self.app.get('/user/add', security.isAuthenticatedAdmin,
        function (req, res) {
            res.render('pages/admin/addUser', {user: req.user});
        });
    
}


module.exports = UserRoutes;