var pg = require('pg');
var dbcfg = require('./config/dbConfig.js');

var status = require('./dao/status.js');
var entry = require('./dao/entry.js');

var Routes = function () {
};


Routes.create = function (app) {

    /**
     * Home page with no parameters
     */
    app.get('/', function (req, res) {
        res.render('pages/index', {});
    });

    /**
     * Main cateory 'radar' pages
     */
    app.get('/radar/:category', function (req, res) {
       
        var cname = replaceAll(req.params.category , '-' , ' ');
        entry.getValues( cname , function( values ) {
            console.log(values);
            
            if( values.length==0) {
                res.render('pages/error');
            } else {
                var category = values[0].category;
                res.render('pages/radar', {category: category, entries: values});
            }
        });
    });

    
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

module.exports = Routes;
