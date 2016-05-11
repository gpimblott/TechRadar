var category = require('../../dao/category.js');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var passport = require('passport');
var security = require('../../utils/security.js');

var apiutils = require('./apiUtils.js');

var sanitizer = require('sanitize-html');


var ApiCategoryRoutes = function () {
};

ApiCategoryRoutes.createRoutes = function (self) {
    
    /**
     * Get all categories
     */
    self.app.get('/api/categories', security.isAuthenticated,
        function (req, res) {
            category.getAll(function (result) {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(result));
            });
        });

    self.app.post('/api/category', security.isAuthenticatedAdmin,
        function (req, res) {
            category.add(
                sanitizer( req.body.name ),
                sanitizer( req.body.description ),
                function (result , error ) {
                    if(result) {
                        cache.refresh(self.app);
                    }
                    apiutils.handleResultSet( res, result , error );
                });
        });

    self.app.delete('/api/category', security.isAuthenticatedAdmin, jsonParser,
        function (req, res) {
            var data = req.body.id ;

            category.delete( data , function( result , error ) {
                apiutils.handleResultSet( res, result , error );
            })
        });


}

module.exports = ApiCategoryRoutes;