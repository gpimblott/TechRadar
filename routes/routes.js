/**
 *  These are the routes for the Web Application
 */

var cache = require('../dao/cache.js');
var users = require('../dao/users');
var technology = require('../dao/technology.js');
var category = require('../dao/category.js');
var comments = require('../dao/comments.js');
var projects = require('../dao/projects.js');
var votes = require('../dao/vote.js');


var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var passport = require('passport');

var security = require('../utils/security.js');


var Routes = function () {
};

/**
 *  Create the routing table entries + handlers for the application.
 */
Routes.createRoutes = function (self) {

    /**
     * Homw page
     */
    self.app.get('/', security.isAuthenticated,
        function (req, res) {
            var url = req.session.redirect_to;
            if (url != undefined) {
                delete req.session.redirect_to;
                res.redirect(url);
            }
            else {
                res.render('pages/index', {user: req.user});
            }
        });

    /**
     * Error page
     */
    self.app.get('/error', security.isAuthenticated,
        function (req, res) {
            res.render('pages/error');
        });

    /**
     * Login page
     */
    self.app.get('/login', function (req, res) {
        if (res.isAuthenticated) {
            res.render('pages/index')
        } else {
            res.render('pages/login');
        }
    });

    /**
     * POST login credentials
     */
    self.app.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));


    /**
     * Logout
     */
    self.app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/login');
    });


    /**
     * Stack builder
     */
    self.app.get('/stacks', security.isAuthenticated, function (req, res) {
        res.render('pages/listStacks', {user: req.user});
    });

    self.app.get('/stack/add', security.isAuthenticated, function (req, res) {
        res.render('pages/addStack', {user: req.user});
    });

    /**
     * Radar for category
     */
    self.app.get('/radar/:category', security.isAuthenticated, function (req, res) {

        var cname = decodeURI(req.params.category);
        technology.getAllForCategory(cname.toLowerCase(), function (values) {

            var category = cache.getCategory(cname);

            res.render('pages/radar', {category: category, technologies: values, user: req.user});
        });
    });

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
     * Add a new comment for technology page
     */
    self.app.get('/comments/add/:id', security.isAuthenticated,
        function (req, res) {
            var num = req.params.id;
            technology.getById(num, function (value) {
                res.render('pages/addComment', {technology: value, user: req.user});
            });
        });


    /**
     * Users page
     */
    self.app.get('/users', security.isAuthenticatedAdmin,
        function (req, res) {
            res.render('pages/admin/listUsers', {user: req.user});
        });


    /**
     * Add new user page
     */
    self.app.get('/user/add', security.isAuthenticatedAdmin,
        function (req, res) {
            res.render('pages/admin/addUser', {user: req.user});
        });


    /**
     * List projects page
     */
    self.app.get('/projects', security.isAuthenticatedAdmin,
        function (req, res) {
            res.render('pages/admin/listProjects', {user: req.user});
        });

    /**
     * Add new project page
     */
    self.app.get('/project/add', security.isAuthenticatedAdmin,
        function (req, res) {
            res.render('pages/admin/addProject', {user: req.user});
        });

    /**
     * List categories
     */
    self.app.get('/categories', security.isAuthenticatedAdmin,
        function (req, res) {
            res.render('pages/admin/listCategories', {user: req.user});
        });

    /**
     * Add new category page
     */
    self.app.get('/category/add', security.isAuthenticatedAdmin,
        function (req, res) {
            res.render('pages/admin/addCategory', {user: req.user});
        });
}

module.exports = Routes;
