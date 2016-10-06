var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var security = require('../../utils/security.js');
var handler = require('../../handlers/api/softwareVersionsApiHandler.js');

var ApiSoftwareVersionsRoutes = function () {
};

ApiSoftwareVersionsRoutes.createRoutes = function (self) {

  
    /**
     * Get all versions for technology 
     */
    self.app.get('/api/technology/:technology/versions', security.isAuthenticated, handler.getAllVersionsForTechnology);

    /**
     * Add a new software version and assign it to a technology
     */
    self.app.post('/api/technology/versions/add', handler.addVersion);

}

module.exports = ApiSoftwareVersionsRoutes;