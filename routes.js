var bodyParser = require('body-parser');
var pg = require('pg');
var technology = require('./dao/technology.js');
var cache = require('./dao/cache.js');

var passport = require('passport');
var Strategy = require('passport-http').BasicStrategy;

// create application/json parser
var jsonParser = bodyParser.json();

var Routes = function () {
};


Routes.create = function (app) {

    /**
     * Home page with no parameters
     */
    app.get('/',
        passport.authenticate('basic', {session: false}),
        function (req, res) {
            res.render('pages/index', {});
        });

    /**
     * Main category 'radar' pages
     */
    app.get('/radar/:category', function (req, res) {

        var cname = replaceAll(req.params.category, '-', ' ');
        technology.getValuesForCategory(cname, function (values) {
            
            if (values.length == 0) {
                res.render('pages/error');
            } else {

                var category = cache.getCategory(values[0].category);

                res.render('pages/radar', {category: category, technologies: values});
            }
        });
    });

    
    app.get('/technology/view/:id', function (req, res) {
        var num = req.params.id;
        technology.getById(num, function (value) {
            if (value.length == 0 || value.length >1 ) {
                res.render('pages/error');
            } else {
                res.render('pages/technology', {technology: value[0]});
            }
        });
    });

    app.get('/technology/comment/add/:id', function (req, res) {
        var num = req.params.id;
        technology.getById(num, function (value) {
            if (value.length == 0 || value.length >1 ) {
                res.render('pages/error');
            } else {
                res.render('pages/addComment', {technology: value[0]});
            }
        });
    });

    app.get('/technology/add', function (req, res) {
        res.render('pages/addTechnology', {categories: cache.getCategories()});
    });


    app.post('/technology/add', jsonParser, function (req, res) {

        var status = cache.getStatus('tbd');
        technology.add(req.body.technologyName,
            req.body.technologyWebsite,
            req.body.technologyCategory,
            req.body.technologyDescription,status.id,
        function( result ) {
            console.log(result);
            if( undefined === result) {
                res.render('pages/error');
            } else {
                res.redirect('/technology/view/' + result);
            }
        });


    });


}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

module.exports = Routes;
