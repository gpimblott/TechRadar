var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var security = require('../../utils/security.js');

var handler = require('../../handlers/api/categoriesApiHandler.js');

var ApiCategoryRoutes = function () {
};

ApiCategoryRoutes.createRoutes = function (self) {
    
    self.app.get('/api/categories', security.isAuthenticated, handler.getCategories);
    self.app.post('/api/category', security.isAuthenticatedAdmin, handler.addCategory(self.app));
    self.app.delete('/api/category', security.isAuthenticatedAdmin, jsonParser, handler.deleteCategories(self.app));

};

module.exports = ApiCategoryRoutes;