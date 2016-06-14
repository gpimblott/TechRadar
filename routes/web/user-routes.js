var handler = require('../../handlers/web/usersWebHandler');
var security = require('../../utils/security');

var UserRoutes = function () {
};


UserRoutes.createRoutes = function (self) {

    /**
     * Users page
     */
    self.app.get('/users', security.isAuthenticatedAdmin, handler.list);


    /**
     * Add new user page
     */
    self.app.get('/user/add', security.isAuthenticatedAdmin, handler.add);

    /**
     * Edit the current users profile page
     */
    self.app.get('/profile', security.isAuthenticated, handler.editProfile);

    /**
     * Edit specific user page
     */
    self.app.get('/user/:userId/edit', security.isAuthenticatedAdmin, handler.editUser);

}


module.exports = UserRoutes;