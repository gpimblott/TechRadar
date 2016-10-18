/**
 *  Main routes for the Application
 */

var technology = require('../../dao/technology.js');

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
    self.app.get('/error',
        function (req, res) {
            if (req.isAuthenticated()) {
                res.render('pages/errorLoggedIn', {user: req.user});
            } else {
                res.render('pages/error');
            }
        });

    /**
     * Login page
     */
    self.app.get('/login', function (req, res) {
        if (req.isAuthenticated()) {
            res.render('pages/index', { user: req.user });
        } else {
            var messages = req.flash('error');
            res.render('pages/login', {messages: messages});
        }
    });

    /**
     * Sign up page
     */
    self.app.get('/signup', function (req, res) {
        if (req.isAuthenticated()) {
            res.render('pages/index', { user: req.user });
        } else {
            res.render('pages/signup');
        }
    });

    self.app.get('/dashboard', security.isAuthenticated, function (req, res) {
        res.render('pages/dashboards/dashboard', {user: req.user});
    });

    self.app.get('/mindmap/project/:project', security.isAuthenticated, function (req, res) {
        req.checkParams('project', 'Invalid project name').isAlpha();

        var errors = req.validationErrors();
        if (errors) {
            res.redirect('/error');
            return;
        }

        var pid = req.params.project;

        technology.getAllForProject(pid, function (error, result) {
            if (error) {
                console.log(error);
                res.redirect('/error');
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
        failureRedirect: '/login',
        failureFlash: true
    }));

    self.app.get('/loginAzureAD',
        passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
            function (req, res) {
            res.redirect('/');
        }
    );

    /* Accept login request */
    self.app.post('/auth/openid/return',
        passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
        function (req, res) {
            res.redirect('/');
        }
    );

    /* Logout */
    self.app.get('/logout', function (req, res) {
        req.session.destroy(function(err) {
            var postLogoutRedirectUri = req.protocol + "://" + req.get('host');
            req.logOut();
            res.redirect('https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri='+postLogoutRedirectUri);
        });
    });

    // GET /auth/openid/return
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.
    self.app.get('/auth/openid/return',
        passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
        function (req, res) {
            res.redirect('/');
        }
    );
};

module.exports = Routes;
