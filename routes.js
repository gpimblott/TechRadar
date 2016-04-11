var cache = require('./dao/cache.js');
var users = require('./dao/users');
var technology = require('./dao/technology.js');
var category = require('./dao/category.js');
var comments = require('./dao/comments.js');
var projects = require('./dao/projects.js');
var votes = require('./dao/vote.js');


var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var passport = require('passport');
var Strategy = require('passport-local').Strategy;

/**
 * Check if the users is authenticated
 */
var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    req.session.redirect_to = req.url;
    res.redirect('/login');
}

var isAuthenticatedAdmin = function (req, res, next) {
    if (req.isAuthenticated() && req.user.admin)
        return next();
    req.session.redirect_to = req.url;
    res.redirect('/login');
}

var Routes = function () {
};
/**
 *  Create the routing table entries + handlers for the application.
 */
Routes.createRoutes = function (self) {

    self.app.get('/', isAuthenticated,
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

    self.app.get('/error', isAuthenticated,
        function (req, res) {
            res.render('pages/error');
        });

    /**
     * Login GET and POST
     */
    self.app.get('/login', function (req, res) {
        if (res.isAuthenticated) {
            res.render('pages/index')
        } else {
            res.render('pages/login');
        }
    });

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


    self.app.get('/stackbuilder', isAuthenticated, function (req, res) {
            res.render('pages/stackbuilder', { user: req.user});
    });

    /**
     * Main category 'radar' pages
     */
    self.app.get('/radar/:category', isAuthenticated, function (req, res) {

        var cname = replaceAll(req.params.category, '-', ' ');
        technology.getValuesForCategory(cname, function (values) {

            if (values.length == 0) {
                res.render('pages/error');
            } else {

                var category = cache.getCategory(values[0].category);

                res.render('pages/radar', {category: category, technologies: values, user: req.user});
            }
        });
    });

    /**
     * Technology pages
     */
    self.app.get('/technologies', isAuthenticatedAdmin, jsonParser, function (req, res) {
        res.render('pages/listTechnologies', {user: req.user});
    });

    self.app.get('/technology/search', isAuthenticated, jsonParser, function (req, res) {
        res.render('pages/search', {user: req.user});
    });

    self.app.get('/technology/add', isAuthenticated, function (req, res) {
        res.render('pages/addTechnology', {categories: cache.getCategories(), user: req.user});
    });


    self.app.get('/technology/:id', isAuthenticated, function (req, res) {
        var num = req.params.id;
        technology.getById(num, function (value) {
            if (value.length == 0 || value.length > 1) {
                res.render('pages/error', {user: req.user});
            } else {
                comments.getValuesForTechnology(num, function (comments) {
                    votes.getVotesForTechnology( num, function ( votes ) {
                        var statuses = cache.getStatuses();
                        res.render('pages/technology', 
                            {technology: value[0], comments: comments, votes: votes, user: req.user, statuses: statuses});
                    })
                    
                });
            }
        });
    });


    /**
     * Comments
     */
    self.app.get('/comments/add/:id', isAuthenticated,
        function (req, res) {
            var num = req.params.id;
            technology.getById(num, function (value) {
                if (value.length == 0 || value.length > 1) {
                    res.render('pages/error');
                } else {
                    res.render('pages/addComment', {technology: value[0], user: req.user});
                }
            });

        });


    /**
     * Users
     *
     */
    self.app.get('/users', isAuthenticatedAdmin,
        function (req, res) {
            res.render('pages/listUsers', {user: req.user});
        });


    self.app.get('/user/add', isAuthenticatedAdmin,
        function (req, res) {
            res.render('pages/addUser', {user: req.user});
        });


    /**
     * Projects
     *
     */
    self.app.get('/projects', isAuthenticatedAdmin,
        function (req, res) {
            res.render('pages/listProjects', {user: req.user});
        });

    self.app.get('/project/add', isAuthenticatedAdmin,
        function (req, res) {
            res.render('pages/addProject', {user: req.user});
        });

    /**
     * Categories
     *
     */
    self.app.get('/categories', isAuthenticatedAdmin,
        function (req, res) {
            res.render('pages/listCategories', {user: req.user});
        });

    /*****************************************************
     * API Interfaces
     ******************************************************/

    /**
     * Technology
     */
    self.app.post('/api/technology/:technology/vote', isAuthenticated, jsonParser, function (req, res) {
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
     * Update the status of a technology
     */
    self.app.post('/api/technology/:technology/status', isAuthenticatedAdmin, jsonParser, function (req, res) {
        var status = req.body.statusvalue;
        var tech = req.params.technology;
        technology.updateStatus( tech, status, function(result) {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify({value: "ok", vote: result}));
        })

    });

    self.app.get('/api/technologies', isAuthenticatedAdmin, jsonParser, function (req, res) {

        technology.getAll( function (result) {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(result));
        })
    });

    self.app.get('/api/technology', isAuthenticated, jsonParser, function (req, res) {

        technology.search(req.query.search, function (result) {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(result));
        })
    });


    self.app.post('/api/technology', isAuthenticated, jsonParser, function (req, res) {
        var status = cache.getStatus('tbd');
        technology.add(req.body.technologyName,
            req.body.technologyWebsite,
            req.body.technologyCategory,
            req.body.technologyDescription, status.id,
            function (result) {

                if (undefined === result) {
                    res.render('pages/error');
                } else {
                    res.redirect('/technology/' + result);
                }
            });
    });


    /**
     * Users
     */
    self.app.post('/api/user', isAuthenticatedAdmin, jsonParser,
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

    self.app.get('/api/users', isAuthenticatedAdmin,
        function (req, res) {
            users.getAll(function (result) {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(result));
            });
        });

    /**
     * Comments
     */
    self.app.post('/api/comments', isAuthenticated, jsonParser,
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
     * Projects
     */
    self.app.get('/api/projects', isAuthenticatedAdmin,
        function (req, res) {
            projects.getAll(function (result) {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(result));
            });
        });

    self.app.post('/api/project', isAuthenticatedAdmin, jsonParser,
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
     * Categories
     */
    self.app.get('/api/categories', isAuthenticatedAdmin,
        function (req, res) {
            category.getAll(function (result) {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(result));
            });
        });
    

}


function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

module.exports = Routes;
