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


var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var passport = require('passport');

var security = require('../utils/security.js');


var ApiRoutes = function () {
};


/*****************************************************
 * API Interfaces
 ******************************************************/
ApiRoutes.createRoutes = function (self) {

    /**
     * Add a vote for a technology
     */
    self.app.post('/api/technology/:technology/vote', security.isAuthenticated, jsonParser, function (req, res) {
        votes.add(req.params.technology, req.body.statusvalue, req.user.id, function (result, error) {
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
    self.app.get('/api/technologies', security.isAuthenticated, jsonParser, function (req, res) {

        var search = req.query.search;

        if (search == null) {

            technology.getAll(function (result) {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(result));
            })

        } else {

            technology.search(req.query.search, function (result) {
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

            technology.add(req.body.technologyName,
                req.body.technologyWebsite,
                req.body.technologyCategory,
                req.body.technologyDescription,
                function (result, error) {

                    if (null === result) {
                        res.writeHead(200, {"Content-Type": "application/json"});
                        var data = {};
                        data.error = error;
                        data.success = false;
                        res.end(JSON.stringify(data));
                    } else {
                        res.writeHead(200, {"Content-Type": "application/json"});
                        var data = {};
                        data.id = result;
                        data.success = true;
                        res.end(JSON.stringify(data));
                    }
                });
        });

    /**
     * Update a technology
     */
    self.app.put('/api/technology/:technology', security.isAuthenticated, jsonParser,
        function (req, res) {
            var techid = req.params.technology;

            technology.update(
                techid,
                req.body.name,
                req.body.website,
                req.body.category,
                req.body.description,

                function (result) {

                    res.writeHead(200, {"Content-Type": "application/json"});
                    var data = {};

                    if (result) {
                        data.result = result;
                        data.success = true;
                        res.end(JSON.stringify(data));
                    } else {
                        data.error = error;
                        data.success = false;
                        res.end(JSON.stringify(data));
                    }
                });
        });

    /**
     * Get all votes for a technology
     */
    self.app.get('/api/votes/:technology', security.isAuthenticated,
        function (req, res) {
            var techid = req.params.technology;
            var limit = req.query.limit;

            votes.getVotesForTechnology(techid, limit, function (result) {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(result));
            });
        });

    /**
     * Get the status history of a technology
     */
    self.app.get('/api/technology/:technology/status/history', security.isAuthenticated, jsonParser, function (req, res) {
        var tech = req.params.technology;
        var limit = req.query.limit;

        status.getHistoryForTechnology(tech, limit, function (result) {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(result));
        })

    });

    /**
     * Get the vote history for a technology
     */
    self.app.get('/api/technology/:technology/vote/history', security.isAuthenticated, jsonParser, function (req, res) {
        var tech = req.params.technology;
        var limit = req.query.limit;
        votes.getVotesForTechnology(tech, limit, function (result) {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(result));
        })

    });

    /**
     * Get the votes for a technology
     */
    self.app.get('/api/technology/:technology/vote/totals', security.isAuthenticated, jsonParser, function (req, res) {
        var tech = req.params.technology;
        votes.getTotalVotesForTechnologyStatus(tech, function (result) {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(result));
        })

    });

    /**
     * Update the status of a technology
     */
    self.app.post('/api/technology/:technology/status', security.isAuthenticatedAdmin, jsonParser, function (req, res) {
        var status = req.body.statusvalue;
        var reason = req.body.reason;
        var tech = req.params.technology;

        technology.updateStatus(tech, status, reason, req.user.id, function (result, error) {
            res.writeHead(200, {"Content-Type": "application/json"});
            var data = {};

            if ( result != null ) {
                data.success = true;
                data.id = result;
                res.end(JSON.stringify(data));
            } else {
                data.success = false;
                data.error = error;
                res.end(JSON.stringify(data));
            }

        })

    });


    /**
     * Add a new User
     */
    self.app.post('/api/user', security.isAuthenticatedAdmin, jsonParser,
        function (req, res) {

            users.add(
                req.body.username,
                req.body.displayName,
                req.body.password,
                req.body.role,

                function (result) {

                    res.writeHead(200, {"Content-Type": "application/json"});
                    var data = {};

                    if ( result != null  ) {
                        data.id = result;
                        data.success = true;
                        res.end(JSON.stringify(data));
                    } else {
                        data.error = error;
                        data.success = false;
                        res.end(JSON.stringify(data));
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
     * Get comments for a technology
     */
    self.app.get('/api/comments', security.isAuthenticated,
        function (req, res) {
            var techid = req.query.technologyid;
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
                req.body.technology,
                req.body.comment,
                req.user.id,

                function (result, error) {

                    res.writeHead(200, {"Content-Type": "application/json"});
                    var data = {};

                    if ( result != null  ) {
                        data.id = result;
                        data.success = true;
                        res.end(JSON.stringify(data));
                    } else {
                        data.error = error;
                        data.success = false;
                        res.end(JSON.stringify(data));
                    }
                });
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
                req.body.projectname,

                function ( result , error ) {

                    res.writeHead(200, {"Content-Type": "application/json"});
                    var data = {};

                    if ( result != null  ) {
                        data.id = result;
                        data.success = true;
                        res.end(JSON.stringify(data));
                    } else {
                        data.error = error;
                        data.success = false;
                        res.end(JSON.stringify(data));
                    }
                    
                });
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


}


module.exports = ApiRoutes;
