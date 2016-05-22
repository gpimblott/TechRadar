var cache = require('../../dao/cache.js');
var users = require('../../dao/users');
var technology = require('../../dao/technology');
var security = require('../../utils/security.js');

var CategoryRoutes = function () {
};


CategoryRoutes.createRoutes = function (self) {

    /**
     * List categories
     */
    self.app.get('/categories', security.isAuthenticatedAdmin,
        function (req, res) {
            res.render('pages/admin/listCategories', {user: req.user});
        });

    /**
     * Add new category page
     */
    self.app.get('/category/add', security.isAuthenticatedAdmin,
        function (req, res) {
            res.render('pages/admin/addCategory', {user: req.user});
        });


    /**
     * Get all technologies for for category
     */
    self.app.get('/category/:category/technologies', security.isAuthenticated, function (req, res) {

        var cname = decodeURI(req.params.category);
        technology.getAllForCategory(cname.toLowerCase(), function (values) {

            var category = cache.getCategory(cname);

            res.render('pages/categoryRadar', {category: category, technologies: values, user: req.user});
        });
    });
}


module.exports = CategoryRoutes;