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

/**
 *  Create the routing table entries + handlers for the application.
 */

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
                res.end(JSON.stringify({value: "nok"}));
            } else {
                res.end(JSON.stringify({value: "ok", vote: result}));
            }
        });
    });
    
    /**
     * Get all technologies
     */
    self.app.get('/api/technologies', security.isAuthenticatedAdmin, jsonParser, function (req, res) {
        
        technology.getAll(function (result) {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(result));
        })
    });


    /**
     * Get all of the technologies for a given search string
     */
    self.app.get('/api/technology', security.isAuthenticated, jsonParser, function (req, res) {

        technology.search(req.query.search, function (result) {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(result));
        })
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
                function (result) {

                    if (undefined === result) {
                        res.render('pages/error');
                    } else {
                        res.redirect('/technology/' + result);
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
                    res.end(JSON.stringify({result: result}));
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
     * Get the status of a technology
     */
    self.app.get('/api/technology/:technology/status', security.isAuthenticated, jsonParser, function (req, res) {
        var tech = req.params.technology;
        var limit = req.query.limit;
        status.getHistoryForTechnology( tech , limit, function (result) {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(result));
        })

    });

    /**
     * Get the votes for a technology
     */
    self.app.get('/api/technology/:technology/vote', security.isAuthenticated, jsonParser, function (req, res) {
        var tech = req.params.technology;
        var limit = req.query.limit;
        votes.getVotesForTechnology( tech , limit, function (result) {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(result));
        })

    });

    /**
     * Get the votes for a technology
     */
    self.app.get('/api/technology/:technology/vote/status', security.isAuthenticated, jsonParser, function (req, res) {
        var tech = req.params.technology;
        votes.getTotalVotesForTechnologyAndStatus( tech , function (result) {
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
        
        technology.updateStatus(tech, status, reason, req.user.id, function (result) {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify({value: "ok", statusid: result}));
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
                    if (undefined === result) {
                        res.render('pages/error');
                    } else {
                        res.redirect('/users');
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

                function (result) {
                    if (undefined === result) {
                        res.render('pages/error');
                    } else {
                        res.redirect('/technology/' + req.body.technology);
                    }
                });
        });


    /**
     * Get all projects
     */
    self.app.get('/api/projects', security.isAuthenticatedAdmin,
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

                function (result) {
                    if (undefined === result) {
                        res.render('pages/error');
                    } else {
                        res.redirect('/projects');
                    }
                });
        });

    /**
     * Get all categories
     */
    self.app.get('/api/categories', security.isAuthenticatedAdmin,
        function (req, res) {
            category.getAll(function (result) {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(result));
            });
        });


}


module.exports = ApiRoutes;
