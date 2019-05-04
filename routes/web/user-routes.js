"use strict";

const handler = require('../../handlers/web/usersWebHandler');
const security = require('../../utils/security');

const UserRoutes = function () {
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

    /**
     * Reset a users password page
     */
    self.app.get('/user/resetpassword', handler.resetPassword);

    /**
     * Generate a reset password code page
     */
    self.app.get('/user/generateresetpassword', handler.generateResetPasswordCode);
};


module.exports = UserRoutes;