var comments = require('../../dao/comments.js');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var passport = require('passport');
var security = require('../../utils/security.js');

var apiutils = require('./apiUtils.js');

var sanitizer = require('sanitize-html');


var ApiCommentRoutes = function () {
};

ApiCommentRoutes.createRoutes = function (self) {

    /**
     * Add a new comment for a technology
     */
    self.app.post('/api/comments', security.isAuthenticated, jsonParser,
        function (req, res) {

            comments.add(
                sanitizer( req.body.technology ),
                sanitizer( req.body.comment ),
                sanitizer( req.user.id ),

                function (result, error) {
                    apiutils.handleResultSet( res, result , error );
                });
        });

    /**
     * Delete comments
     */
    self.app.delete('/api/comments', security.isAuthenticatedAdmin, jsonParser,
        function (req, res) {
            var data =  req.body.id ;

            comments.delete( data , function( result , error ) {
                apiutils.handleResultSet( res, result , error );
            })
        });


};

module.exports = ApiCommentRoutes;