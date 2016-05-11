/**
 *  These are the routes implement the REST API services
 */

var stacks = require('../../dao/stacks.js');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var passport = require('passport');

var security = require('../../utils/security.js');

var sanitizer = require('sanitize-html');

var apiutils = require('./apiUtils.js');

var ApiStackRoutes = function () {
};

/*****************************************************
 * API Interfaces
 ******************************************************/
ApiStackRoutes.createRoutes = function (self) {


    /**
     * Get all stacks
     */
    self.app.get('/api/stacks', security.isAuthenticated,
        function (req, res) {
            stacks.getAll(function (result) {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(result));
            });
        });

    /**
     * Add a new stack
     */
    self.app.post('/api/stack', security.isAuthenticated, jsonParser,
        function (req, res) {

            stacks.add(
                sanitizer( req.body.name ),
                sanitizer( req.body.description ),

                function ( result , error ) {
                    apiutils.handleResultSet( res, result , error );
                });
        });

    /**
     * Delete stack from the database
     */
    self.app.delete('/api/stack', security.isAuthenticatedAdmin, jsonParser,
        function (req, res) {
            var data = req.body.id ;

            stacks.delete( data , function( result , error ) {
                apiutils.handleResultSet( res, result , error );
            })
        });

}


module.exports = ApiStackRoutes;
