"use strict";

/**
 *  These are the routes implement the REST API services
 */

const stacks = require('../../dao/stacks.js');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const security = require('../../utils/security.js');
const sanitizer = require('sanitize-html');
const apiUtils = require('./apiUtils.js');

const ApiStackRoutes = function () {
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
                    apiUtils.handleResultSet( res, result , error );
                });
        });

    /**
     * Delete stack from the database
     */
    self.app.delete('/api/stack', security.isAuthenticatedAdmin, jsonParser,
        function (req, res) {
            const data = req.body.id ;

            stacks.delete( data , function( result , error ) {
                apiUtils.handleResultSet( res, result , error );
            })
        });

}


module.exports = ApiStackRoutes;
