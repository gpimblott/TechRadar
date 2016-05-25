var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var security = require('../../utils/security.js');

var handler = require('../../handlers/api/dashboardApiHandler.js');

var ApiCategoryRoutes = function () {
};

ApiCategoryRoutes.createRoutes = function (self) {
    
    self.app.get('/api/votes', security.isAuthenticated, handler.getCategories);
   
};

module.exports = ApiCategoryRoutes;