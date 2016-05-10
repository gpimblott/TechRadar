/**
 *  These are the routes implement the REST API services
 */

var cache = require('../dao/cache.js');
var users = require('../dao/users');
var technology = require('../dao/technology.js');
var category = require('../dao/category.js');
var comments = require('../dao/comments.js');
var projects = require('../dao/projects.js');
var votes = require('../dao/vote.js');
var status = require('../dao/status.js');
var stacks = require('../dao/stacks.js');


var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var passport = require('passport');

var security = require('../utils/security.js');

var sanitizer = require('sanitize-html');

var ApiRoutes = function () {
};


/**
 * Standard approach to returning results
 * @param res The response object
 * @param result The result returned from the
 */
handleResultSet = function( res , result  , error ) {
    res.writeHead(200, {"Content-Type": "application/json"});

    var data = {};
    if ( result ) {
        data.result = result;
        data.success = true;
    } else {
        data.error = error;
        data.success = false;
    }
    res.end(JSON.stringify(data));
}

/*****************************************************
 * API Interfaces
 ******************************************************/
ApiRoutes.createRoutes = function (self) {

    /**
     * Add a vote for a technology
     */
    self.app.post('/api/technology/:technology/vote', security.isAuthenticated, jsonParser, function (req, res) {
        var tech = sanitizer( req.params.technology );
        var statusValue = sanitizer( req.body.statusvalue );
        var userId = sanitizer( req.user.id );

        votes.add(tech, statusValue , userId , function (result, error) {
            res.writeHead(200, {"Content-Type": "application/json"});
            if (error != null) {
                res.end(JSON.stringify({success: false, error: error}));
            } else {
                res.end(JSON.stringify({success: true, vote: result}));
            }
        });
    });

    /**
     * Get all technologies
     */
    self.app.get('/api/technology', security.isAuthenticated, jsonParser, function (req, res) {

        var search = req.query.search ;

        if (search == null) {

            technology.getAll(function (result) {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(result));
            })

        } else {

            technology.search(sanitizer( search ), function (result) {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(result));
            })
        }
    });


    /**
     * Add a new technology
     */
    self.app.post('/api/technology', security.isAuthenticated, jsonParser,
        function (req, res) {

            technology.add(
                sanitizer( req.body.technologyName),
                sanitizer( req.body.technologyWebsite),
                sanitizer( req.body.technologyCategory),
                sanitizer( req.body.technologyDescription) ,
                function (result, error) {
                    handleResultSet( res , result , error );
                });
        });

    /**
     * Update a technology
     */
    self.app.put('/api/technology/:technology', security.isAuthenticated, jsonParser,
        function (req, res) {
            var techid = sanitizer( req.params.technology );

            technology.update(
                techid,
                sanitizer( req.body.name ),
                sanitizer( req.body.website ),
                sanitizer( req.body.category ),
                sanitizer( req.body.description ),

                function (result , error ) {
                    handleResultSet( res, result , error );
                });
        });

    /**
     * Delete technologies
     */
    self.app.delete('/api/technology', security.isAuthenticatedAdmin, jsonParser,
        function (req, res) {
            var data = req.body.id ;

            technology.delete( data , function( result , error ) {
                handleResultSet( res, result , error );
            })
        });

    /**
     * Get all votes for a technology
     */
    self.app.get('/api/votes/:technology', security.isAuthenticated,
        function (req, res) {
            var techid = sanitizer( req.params.technology );
            var limit = sanitizer( req.query.limit );

            votes.getVotesForTechnology(techid, limit, function (result) {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(result));
            });
        });

    /**
     * Get the status history of a technology
     */
    self.app.get('/api/technology/:technology/status/history', security.isAuthenticated, jsonParser, function (req, res) {
        var tech = sanitizer( req.params.technology );
        var limit = sanitizer( req.query.limit );

        status.getHistoryForTechnology(tech, limit, function (result) {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(result));
        })

    });

    /**
     * Get the vote history for a technology
     */
    self.app.get('/api/technology/:technology/vote/history', security.isAuthenticated, jsonParser, function (req, res) {
        var tech = sanitizer( req.params.technology );
        var limit = sanitizer( req.query.limit );
        votes.getVotesForTechnology(tech, limit, function (result) {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(result));
        })

    });

    /**
     * Get the votes for a technology
     */
    self.app.get('/api/technology/:technology/vote/totals', security.isAuthenticated, jsonParser, function (req, res) {
        var tech = sanitizer( req.params.technology );
        votes.getTotalVotesForTechnologyStatus(tech, function (result) {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(result));
        })

    });

    /**
     * Update the status of a technology
     */
    self.app.post('/api/technology/:technology/status', security.isAuthenticatedAdmin, jsonParser, function (req, res) {
        var status = sanitizer( req.body.statusvalue );
        var reason = sanitizer( req.body.reason );
        var tech = sanitizer( req.params.technology );

        technology.updateStatus(tech, status, reason, req.user.id, function (result, error) {
            handleResultSet( res, result , error );
        })

    });


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
                    handleResultSet( res, result , error );
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
                handleResultSet( res, result , error );
            })
        });

    /**
     * Get comments for a technology
     */
    self.app.get('/api/comments', security.isAuthenticated,
        function (req, res) {
            var techid = sanitizer( req.query.technologyid );
            comments.getForTechnology(techid, function (result) {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(result));
            });
        });

    /**
     * Add a new comment for a technology
     */
    self.app.post('/api/comments', security.isAuthenticated, jsonParser,
        function (req, res) {

            comments.add(
                sanitizer( req.body.technology ),
                sanitizer( req.body.comment ),
                sanitizer( req.user.id ),

                function (result, error) {
                    handleResultSet( res, result , error );
                });
        });

    /**
     * Delete comments
     */
    self.app.delete('/api/comments', security.isAuthenticatedAdmin, jsonParser,
        function (req, res) {
            var data =  req.body.id ;

            comments.delete( data , function( result , error ) {
                handleResultSet( res, result , error );
            })
        });


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
                    handleResultSet( res, result , error );
                });
        });

    /**
     * Delete projects from the database
     */
    self.app.delete('/api/project', security.isAuthenticatedAdmin, jsonParser,
        function (req, res) {
            var data = req.body.id ;

            projects.delete( data , function( result , error ) {
                handleResultSet( res, result , error );
            })
        });

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
                    handleResultSet( res, result , error );
                });
        });

    /**
     * Delete stack from the database
     */
    self.app.delete('/api/stack', security.isAuthenticatedAdmin, jsonParser,
        function (req, res) {
            var data = req.body.id ;

            stacks.delete( data , function( result , error ) {
                handleResultSet( res, result , error );
            })
        });


    /**
     * Get all categories
     */
    self.app.get('/api/categories', security.isAuthenticated,
        function (req, res) {
            category.getAll(function (result) {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(result));
            });
        });

    self.app.post('/api/category', security.isAuthenticatedAdmin,
        function (req, res) {
            category.add(
                sanitizer( req.body.name ),
                sanitizer( req.body.description ),
                function (result , error ) {
                    if(result) {
                        cache.refresh(self.app);
                    }
                    handleResultSet( res, result , error );
            });
        });

    self.app.delete('/api/category', security.isAuthenticatedAdmin, jsonParser,
        function (req, res) {
            var data = req.body.id ;

            category.delete( data , function( result , error ) {
                handleResultSet( res, result , error );
            })
        });

}


module.exports = ApiRoutes;
