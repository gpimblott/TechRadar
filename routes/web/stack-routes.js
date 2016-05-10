var users = require('../../dao/users');

var technology = require('../../dao/technology.js');
var comments = require('../../dao/comments.js');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var passport = require('passport');
var security = require('../../utils/security.js');

var StackRoutes = function () {
};


StackRoutes.createRoutes = function (self) {

    /**
     * Stack builder
     */
    self.app.get('/stacks', security.isAuthenticated, function (req, res) {
        res.render('pages/listStacks', {user: req.user});
    });

    self.app.get('/stack/add', security.isAuthenticated, function (req, res) {
        res.render('pages/addStack', {user: req.user});
    });

}

module.exports = StackRoutes;