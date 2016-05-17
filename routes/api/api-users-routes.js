var users = require('../../dao/users.js');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var passport = require('passport');
var security = require('../../utils/security.js');

var apiutils = require('./apiUtils.js');

var sanitizer = require('sanitize-html');
var crypto = require('crypto');
var userValidator  = require('../../shared/validators/userValidator.js');
var multer  = require('multer');

var storage = multer.diskStorage({
    destination: "./uploads",
    filename: function (req, file, cb) {
        var nameSplit = file.originalname.split('.');
        var fileNameBase = file.fieldname + '-' + req.user.id + "-" + Date.now() + "-" +
            crypto.createHash('sha256').update(req.sessionID).digest('hex').slice(0,8);

        if(nameSplit.length > 1) {
            var extension = nameSplit[nameSplit.length - 1];
            cb(null, fileNameBase + '.' + extension);
        } else {
            cb(null, fileNameBase);
        }
    }
});
var upload = multer({ storage: storage });


var ApiUserRoutes = function () {
};

ApiUserRoutes.createRoutes = function (self) {


    /**
     * Add a new User
     */
    self.app.post('/api/user', security.isAuthenticatedAdmin, jsonParser,
        function (req, res) {

            var username =  sanitizer( req.body.username );
            var password =  sanitizer( req.body.password );
            var password2 =  sanitizer( req.body.password2 );

            var validationResult = userValidator.validateNewPassword(password, password2);
            validationResult = validationResult.valid ? userValidator.validateUsername(username) : validationResult;

            if(!validationResult.valid) {
                res.writeHead(200, {"Content-Type": "application/json"});
                var data = {};
                data.error = validationResult.message;
                data.success = false;
                res.end(JSON.stringify(data));
                return;
            }

            users.add(
                username,
                sanitizer( req.body.displayName ),
                password,
                sanitizer( req.body.role ),

                function (result , error ) {
                    apiutils.handleResultSet( res, result , error );
                });
        });

    /**
     * Update profile
     */
    self.app.put('/api/user', security.isAuthenticated, upload.single('avatar'),
        function (req, res) {
            var oldPassword = sanitizer(req.body.oldPassword);
            var oldPasswordHash = crypto.createHash('sha256').update(oldPassword).digest('base64');
            var password = sanitizer(req.body.password);
            var confirmPassword = sanitizer(req.body.confirmPassword);
            var displayName = sanitizer(req.body.displayname);
            var avatarPath = "";

            if(req.file) {
                avatarPath = req.file.path;
            }
            
            var validationResult = userValidator.validateNewPasswordChange(password, confirmPassword, oldPassword);
            if(req.file && validationResult.valid) {
                validationResult = userValidator.validateAvatar(req.file);
            }
            if(!validationResult.valid) {
                apiutils.handleResultSet(res, null, validationResult.message);
                return;
            }

            users.findById(req.user.id, function (error, userFromDb) {
                if(error) {
                    apiutils.handleResultSet(res, null, error);
                } else {
                    if(password && userFromDb.password !== oldPasswordHash) {
                        // user wants to change the password but the old one is incorrect
                        apiutils.handleResultSet(res, null, "Old password is incorrect");
                    } else {
                        var passwordHash = userFromDb.password;
                        if(password) {
                            passwordHash = crypto.createHash('sha256')
                                .update(password).digest('base64')
                        }
                        var newAvatarPath = avatarPath ? avatarPath : userFromDb.avatar;

                        users.update(req.user.id, displayName, passwordHash, newAvatarPath, userFromDb.role, function (result, error) {
                            apiutils.handleResultSet(res, result , error);
                        });
                    }
                }
            });
        });

    /**
     * Update an user
     */
    self.app.put('/api/user/:userId', security.isAuthenticatedAdmin, jsonParser,
        function (req, res) {
            var userId = sanitizer(req.params.userId);
            var password = sanitizer(req.body.password);
            var confirmPassword = sanitizer(req.body.confirmPassword);
            var displayName = sanitizer(req.body.displayname);
            var role = sanitizer(req.body.role);

            var validationResult = userValidator.validateNewPassword(password, confirmPassword);
            if(!validationResult.valid) {
                apiutils.handleResultSet(res, null, validationResult.message);
                return;
            }

            users.findById(userId, function (error, userFromDb) {
                if(error) {
                    apiutils.handleResultSet(res, null, error);
                } else {
                    var passwordHash = userFromDb.password;
                    if(password) {
                        passwordHash = crypto.createHash('sha256')
                            .update(password).digest('base64')
                    }

                    users.update(userId, displayName, passwordHash, userFromDb.avatar, role, function (result, error) {
                        apiutils.handleResultSet(res, result, error);
                    });
                }
            });
        });

    /**
     * Get all users
     */
    self.app.get('/api/users', security.isAuthenticatedAdmin,
        function (req, res) {
            users.getAll(function (result) {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(result));
            });
        });

    /**
     * Delete users
     */
    self.app.delete('/api/user', security.isAuthenticatedAdmin, jsonParser,
        function (req, res) {
            var data = req.body.id;

            users.delete( data , function( result , error ) {
                apiutils.handleResultSet( res, result , error );
            })
        });
}

module.exports = ApiUserRoutes;