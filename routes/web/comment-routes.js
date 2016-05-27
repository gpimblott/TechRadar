var handler = require('../../handlers/web/commentsWebHandler');
var security = require('../../utils/security');


var CommentRoutes = function () {
};


CommentRoutes.createRoutes = function (self) {

    /**
     * Add a new comment for technology
     */
    self.app.get('/comments/add/:id', security.isAuthenticated, handler.add );

    /**
     * Get Comments for a technology 
     */
    self.app.get('/comments/:technologyId/:page', security.isAuthenticated, handler.commentsForTechnology );
    
};


module.exports = CommentRoutes;