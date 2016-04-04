var bodyParser = require('body-parser');
var pg = require('pg');
var entry = require('./dao/entry.js');
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
        passport.authenticate('basic', { session: false } ),
        function (req, res) {
            res.render('pages/index', {});
        });

    /**
     * Main cateory 'radar' pages
     */
    app.get('/radar/:category', function (req, res) {

        var cname = replaceAll(req.params.category , '-' , ' ');
        entry.getValues( cname , function( values ) {

            if( values.length==0) {
                res.render('pages/error');
            } else {
                var category = values[0].category;
                res.render('pages/radar', {category: category, entries: values});
            }
        });
    });


    app.get('/technology/add', function (req, res) {
        res.render('pages/addTechnology', {categories: cache.getCategories()});
    });

    app.post('/technology/add', jsonParser,  function (req, res) {
        console.log("Add technology POST");
        console.log( req.body.technologyName );
        console.log( req.body.technologyWebsite );
        console.log( req.body.technologyCategory );
        console.log( req.body.technologyDescription );


        // var user_id = req.body.id;
        // var token = req.body.token;
        // var geo = req.body.geo;

        res.send("POST received");
    });

    
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

module.exports = Routes;
