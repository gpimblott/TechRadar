"use strict";

const cache = require('../../dao/cache.js');
const technology = require('../../dao/technology');

const CategoriesWebHandler = function () {
};

/**
 * List all categories
 */
CategoriesWebHandler.listCategories = function (req, res) {
    res.render('pages/admin/listCategories', {user: req.user});
};

/**
 * Add a new category
 * @param req
 * @param res
 */
CategoriesWebHandler.addCategory = function (req, res) {
    res.render('pages/admin/addCategory', {user: req.user});
};

/**
 * Get the technologies for a category
 * @param req
 * @param res
 */
CategoriesWebHandler.technologiesForCategory = function (req, res) {

    const cname = decodeURI(req.params.category);
    technology.getAllForCategory(cname.toLowerCase(), function (values) {

        const category = cache.getCategory(cname);
        res.render('pages/categoryRadar', {category: category, technologies: values, user: req.user});
    });
};

module.exports = CategoriesWebHandler;