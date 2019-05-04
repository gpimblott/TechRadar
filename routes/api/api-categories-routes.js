"use strict";

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const security = require('../../utils/security.js');
const handler = require('../../handlers/api/categoriesApiHandler.js');

const ApiCategoryRoutes = function () {
};

ApiCategoryRoutes.createRoutes = function (self) {
    
    self.app.get('/api/categories', security.isAuthenticated, handler.getCategories);
    self.app.post('/api/category', security.isAuthenticatedAdmin, handler.addCategory(self.app));
    self.app.delete('/api/category', security.isAuthenticatedAdmin, jsonParser, handler.deleteCategories(self.app));

};

module.exports = ApiCategoryRoutes;