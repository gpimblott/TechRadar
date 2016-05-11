var users = require('../../dao/users.js');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var passport = require('passport');
var security = require('../../utils/security.js');

var apiutils = require('./apiUtils.js');

var sanitizer = require('sanitize-html');


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