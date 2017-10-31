var cache = require('../../dao/cache.js');
var users = require('../../dao/users');
var technology = require('../../dao/technology');

var CategoriesWebHandler = function () {
};

/**
 * Get all categories
 */
CategoriesWebHandler.listCategories = function (req, res) {
    res.render('pages/admin/listCategories', {user: req.user});
};

CategoriesWebHandler.addCategory = function (req, res) {
    res.render('pages/admin/addCategory', {user: req.user});
};

CategoriesWebHandler.technologiesForCategory = function (req, res) {

    var cname = decodeURI(req.params.category);
    technology.getAllForCategory(cname.toLowerCase(), function (values) {

        if (values == null) {
            res.redirect('/error');
            return;
        }

        var category = cache.getCategory(cname);
        res.render('pages/categoryRadar', {category: category, technologies: values, user: req.user});
    });
};

module.exports = CategoriesWebHandler;