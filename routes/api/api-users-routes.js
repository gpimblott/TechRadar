var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var security = require('../../utils/security.js');

var multer  = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

var handler = require('../../handlers/api/usersApiHandler.js');


var ApiUserRoutes = function () {
};

ApiUserRoutes.createRoutes = function (self) {

    /**
     * Add a new User
     */
    self.app.post('/api/user', security.isAuthenticatedAdmin, jsonParser, handler.addUser);

    /**
     * Update an user
     */
    self.app.put('/api/user/:userId', security.isAuthenticatedAdmin, upload.single('avatar'), handler.updateUser);

    /**
     * Update profile
     */
    self.app.put('/api/user', security.isAuthenticated, upload.single('avatar'), handler.updateProfile);

    /**
     * Get all users
     */
    self.app.get('/api/users', security.isAuthenticatedAdmin, handler.getAllUsers);

    /**
     * Delete users
     */
    self.app.delete('/api/user', security.isAuthenticatedAdmin, jsonParser, handler.deleteUsers);

    /**
     * Get user avatar
     */
    self.app.get('/api/user/avatar', security.isAuthenticated, handler.getAvatar);

    /**
     * Reset a users password
     */
    self.app.post('/api/user/resetpassword', handler.resetPassword);

    /**
     * Generates a reset password code and sends it by email
     */
    self.app.post('/api/user/generateresetcode', handler.generateResetPasswordCode);
};

module.exports = ApiUserRoutes;