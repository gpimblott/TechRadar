var cache = require('../../dao/cache.js');
var users = require('../../dao/users');

var technology = require('../../dao/technology.js');
var comments = require('../../dao/comments.js');
var project = require('../../dao/projects.js');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var passport = require('passport');
var security = require('../../utils/security.js');

var TechnologyRoutes = function () {
};


TechnologyRoutes.createRoutes = function (self) {

    /**
     * Technology pages
     */
    self.app.get('/technologies', security.isAuthenticatedAdmin, jsonParser, function (req, res) {
        res.render('pages/admin/listTechnologies', {user: req.user});
    });

    self.app.get('/technology/search', security.isAuthenticated, jsonParser, function (req, res) {
        res.render('pages/search', {user: req.user});
    });

    self.app.get('/technology/add', security.isAuthenticated, function (req, res) {
        res.render('pages/addTechnology', {categories: cache.getCategories(), user: req.user});
    });

    self.app.get('/technology/:id/edit', security.isAuthenticated, function (req, res) {
        var num = req.params.id;
        technology.getById(num, function (value) {
            if (value.length == 0 || value.length > 1) {
                res.render('pages/error', {user: req.user});
            } else {

                var statuses = cache.getStatuses();
                res.render('pages/editTechnology',
                    {
                        technology: value,
                        user: req.user,
                        statuses: statuses
                    });
            }
        });
    });


    self.app.get('/technology/:id', security.isAuthenticated, function (req, res) {
        var num = req.params.id;
        technology.getById(num, function (value) {
            if (value.length == 0 || value.length > 1) {
                res.render('pages/error', {user: req.user});
            } else {
                comments.getForTechnology(num, function (comments) {
                    var statuses = cache.getStatuses();
                    res.render('pages/technology',
                        {
                            technology: value,
                            comments: comments,
                            user: req.user,
                            statuses: statuses
                        });
                })
            }
        });
    });

    /**
     * Status history for technology
     */
    self.app.get('/technology/:id/statushistory', security.isAuthenticated, function (req, res) {
        var techid = req.params.id;

        technology.getById(techid, function (value) {
            res.render('pages/statushistory',
                {
                    technology: value,
                    user: req.user
                });
        });
    });

    /**
     * Votes history for technology
     */
    self.app.get('/technology/:id/votehistory', security.isAuthenticated, function (req, res) {
        var techid = req.params.id;

        technology.getById(techid, function (value) {
            res.render('pages/votehistory',
                {
                    technology: value,
                    user: req.user
                });
        });
    });

    /**
     * Status update history for a technology
     */
    self.app.get('/technology/:id/updatestatus', security.isAuthenticatedAdmin, function (req, res) {
        var techid = req.params.id;

        technology.getById(techid, function (value) {
            var statuses = cache.getStatuses();
            res.render('pages/admin/updateStatus',
                {
                    technology: value,
                    user: req.user,
                    statuses: statuses
                });
        });
    });

    /**
     * Add project to a technology
     */
    self.app.get('/technology/:id/projects', security.isAuthenticatedAdmin, function (req, res) {
        var techid = req.params.id;

        technology.getById(techid, function (technology) {
            if (technology === null) {
                res.render('pages/error', {user: req.user});
            } else {
                project.getAllForTechnology(techid, function (linkedProjects) {
                    project.getAll(function (allProjects) {
                        res.render('pages/admin/addProjectToTechnology',
                            {
                                technology: technology,
                                user: req.user,
                                unassignedProjects: allProjects.filter(function (e) {
                                    return linkedProjects.map(function(linkedEl) {return linkedEl.id}).indexOf(e.id) === -1;
                                })
                            });
                    });
                });
            }
        });
    });

}

module.exports = TechnologyRoutes;