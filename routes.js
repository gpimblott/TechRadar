var cache = require('./dao/cache.js');
var users = require('./dao/users');
var technology = require('./dao/technology.js');
var category = require('./dao/category.js');
var comments = require('./dao/comments.js');


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
            res.render('pages/index' , { user : req.user});
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

                res.render('pages/radar', {category: category, technologies: values,  user : req.user});
            }
        });
    });


    /**
     * Technology View pages
     */
    self.app.get('/technology/view/:id', isAuthenticated, function (req, res) {
        var num = req.params.id;
        technology.getById(num, function (value) {
            if (value.length == 0 || value.length > 1) {
                res.render('pages/error', { user: req.user});
            } else {

                comments.getValuesForTechnology(num, function (comments) {
                    res.render('pages/technology', {technology: value[0], comments: comments, user : req.user});
                });
            }
        });
    });


    /**
     * Technology Add GET and POST
     */
    self.app.get('/technology/add', isAuthenticated, function (req, res) {
        res.render('pages/addTechnology', {categories: cache.getCategories(), user : req.user});
    });


    self.app.post('/technology/add', jsonParser, function (req, res) {

        var status = cache.getStatus('tbd');
        technology.add(req.body.technologyName,
            req.body.technologyWebsite,
            req.body.technologyCategory,
            req.body.technologyDescription, status.id,
            function (result) {

                if (undefined === result) {
                    res.render('pages/error');
                } else {
                    res.redirect('/technology/view/' + result);
                }
            });
    });

    self.app.get('/technology/search', isAuthenticated, jsonParser, function (req, res) {
        res.render('pages/search', {user: req.user});
    });

    self.app.get('/technology/dosearch', isAuthenticated, jsonParser, function (req, res) {

        technology.search(req.query.search, function (result) {
            res.send(result);
        })


    });

    /**
     * Comments
     *
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


    self.app.post('/comments/add', isAuthenticated, jsonParser,
        function (req, res) {
            
            comments.add(
                req.body.technology,
                req.body.comment,
                req.user.id,

                function (result) {
                    if (undefined === result) {
                        res.render('pages/error');
                    } else {
                        res.redirect('/technology/view/' + req.body.technology);
                    }
                });


        });
}


function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

module.exports = Routes;
