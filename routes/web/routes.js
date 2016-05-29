/**
 *  These are the routes for the Web Application
 */

var comments = require('../../dao/comments');
var technology = require('../../dao/technology');
var projects = require('../../dao/projects');

var passport = require('passport');

var security = require('../../utils/security');


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

    self.app.get('/dashboard', security.isAuthenticated, function (req, res) {
        res.render('pages/dashboards/dashboard', {user: req.user});
    });

    self.app.get('/mindmap/project/:project', security.isAuthenticated, function (req, res) {
        var pid = req.params.project;

        technology.getAllForProject(pid, function (error, result) {
            if (error) {
                console.log(error);
                res.render('pages/error');
            } else {
                res.render('pages/dashboards/mindmap', {user: req.user, data: result});
            }
        });
        
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


}

module.exports = Routes;
