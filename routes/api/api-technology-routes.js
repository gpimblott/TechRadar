var technology = require('../../dao/technology.js');
var status = require('../../dao/status.js');
var votes = require('../../dao/vote.js');
var project = require('../../dao/projects.js');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var passport = require('passport');
var security = require('../../utils/security.js');

var apiutils = require('./apiUtils.js');

var sanitizer = require('sanitize-html');


var ApiTechnologyRoutes = function () {
};

ApiTechnologyRoutes.createRoutes = function (self) {

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
                    apiutils.handleResultSet( res , result , error );
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
                    apiutils.handleResultSet( res, result , error );
                });
        });

    /**
     * Delete technologies
     */
    self.app.delete('/api/technology', security.isAuthenticatedAdmin, jsonParser,
        function (req, res) {
            var data = req.body.id ;

            technology.delete( data , function( result , error ) {
                apiutils.handleResultSet( res, result , error );
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
            apiutils.handleResultSet( res, result , error );
        })
    });

    /**
     * Add a project to a technology
     */
    self.app.post('/api/technology/:technology/project', security.isAuthenticated, jsonParser, function (req, res) {
        var projectId = sanitizer(req.body.project);
        var technologyId = sanitizer(req.params.technology);

        technology.addProject(technologyId, projectId, function (result, error) {
            apiutils.handleResultSet(res, result , error);
        })
    });

    /**
     * Get linked Projects
     */
    self.app.get('/api/technology/:technology/projects', security.isAuthenticated, jsonParser, function (req, res) {
        var technologyId = sanitizer(req.params.technology);

        project.getAllForTechnology(technologyId, function (result, error) {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(result));
        });
    });

    /**
     * Remove links to Projects
     */
    self.app.delete('/api/technology/:technology/projects', security.isAuthenticated, jsonParser, function (req, res) {
        var technologyId = sanitizer(req.params.technology);
        var projectIds = req.body.projects;

        technology.removeProjects(technologyId, projectIds, function (result, error) {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(result));
        });
    });

}

module.exports = ApiTechnologyRoutes;