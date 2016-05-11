var projects = require('../../dao/projects.js');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var passport = require('passport');
var security = require('../../utils/security.js');

var apiutils = require('./apiUtils.js');

var sanitizer = require('sanitize-html');


var ApiProjectRoutes = function () {
};

ApiProjectRoutes.createRoutes = function (self) {
    
    /**
     * Get all projects
     */
    self.app.get('/api/projects', security.isAuthenticated,
        function (req, res) {
            projects.getAll(function (result) {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(result));
            });
        });

    /**
     * Add a new project
     */
    self.app.post('/api/project', security.isAuthenticatedAdmin, jsonParser,
        function (req, res) {

            projects.add(
                sanitizer( req.body.projectname ),
                sanitizer( req.body.description ),

                function ( result , error ) {
                    apiutils.handleResultSet( res, result , error );
                });
        });

    /**
     * Delete projects from the database
     */
    self.app.delete('/api/project', security.isAuthenticatedAdmin, jsonParser,
        function (req, res) {
            var data = req.body.id ;

            projects.delete( data , function( result , error ) {
                apiutils.handleResultSet( res, result , error );
            })
        });

}

module.exports = ApiProjectRoutes;