var handler = require('../../handlers/web/categoriesWebHandler.js');
var security = require('../../utils/security.js');

var CategoryRoutes = function () {
};


CategoryRoutes.createRoutes = function (self) {

    /**
     * List categories
     */
    self.app.get('/categories', security.isAuthenticatedAdmin, handler.listCategories);

    /**
     * Add new category page
     */
    self.app.get('/category/add', security.isAuthenticatedAdmin, handler.addCategory);

    /**
     * Get all technologies for for category
     */
    self.app.get('/category/:category/technologies', security.isAuthenticated, handler.technologiesForCategory);
};


module.exports = CategoryRoutes;