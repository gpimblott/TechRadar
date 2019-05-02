const cache = require('../../dao/cache.js');
const technology = require('../../dao/technology');

const CategoriesWebHandler = function () {
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

    const cname = decodeURI(req.params.category);
    technology.getAllForCategory(cname.toLowerCase(), function (values) {

        const category = cache.getCategory(cname);
        res.render('pages/categoryRadar', {category: category, technologies: values, user: req.user});
    });
};

module.exports = CategoriesWebHandler;