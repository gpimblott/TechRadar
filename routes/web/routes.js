/**
 *  These are the routes for the Web Application
 */

var comments = require('../../dao/comments.js');
var technology = require('../../dao/technology.js');

var passport = require('passport');

var security = require('../../utils/security.js');


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
     * Add a new comment for technology page
     */
    self.app.get('/comments/add/:id', security.isAuthenticated,
        function (req, res) {
            var num = req.params.id;
            technology.getById(num, function (value) {
                res.render('pages/addComment', {technology: value, user: req.user});
            });
        });

}

module.exports = Routes;
