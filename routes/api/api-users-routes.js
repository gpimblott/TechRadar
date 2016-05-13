var users = require('../../dao/users.js');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var passport = require('passport');
var security = require('../../utils/security.js');

var apiutils = require('./apiUtils.js');

var sanitizer = require('sanitize-html');
var crypto = require('crypto');


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

            if( password.length < 8) {
                res.writeHead(200, {"Content-Type": "application/json"});
                var data = {};
                data.error = "Password too short";
                data.success = false;
                res.end( JSON.stringify(data) );
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
    self.app.put('/api/user', security.isAuthenticated, jsonParser,
        function (req, res) {
            var oldPasswordHash =  crypto.createHash('sha256').update(sanitizer(req.body.oldPassword)).digest('base64');
            var password =  sanitizer(req.body.password);
            var confirmPassword =  sanitizer(req.body.confirmPassword);
            var displayName =  sanitizer(req.body.displayname);

            var error = validateNewPassword(password, confirmPassword);
            if(error) {
                res.writeHead(200, {"Content-Type": "application/json"});
                var data = {};
                data.error = error;
                data.success = false;
                res.end(JSON.stringify(data));
            }

            users.findById(req.user.id, function (error, userFromDb) {
                if(error) {
                    res.writeHead(200, {"Content-Type": "application/json"});
                    var data = {};
                    data.error = error;
                    data.success = false;
                    res.end(JSON.stringify(data));
                } else {
                    if(password && userFromDb.password !== oldPasswordHash) {
                        // user wants to change the password but the old one is incorrect
                        res.writeHead(200, {"Content-Type": "application/json"});
                        var data = {};
                        data.error = "Old password is incorrect";
                        data.success = false;
                        res.end(JSON.stringify(data));
                    } else {
                        var passwordHash = userFromDb.password;
                        if(password) {
                            passwordHash = crypto.createHash('sha256')
                                .update(password).digest('base64')
                        }

                        users.update(req.user.id, displayName, passwordHash, function (result, error) {
                            apiutils.handleResultSet(res, result , error);
                        });
                    }
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


    var validateNewPassword = function (password, confirmPassword) {
        if(password && password.length < 8) {
            return "Password too short";
        }

        if(password !== confirmPassword){
            return "Passwords do not match";
        }

        return null;
    }
}

module.exports = ApiUserRoutes;