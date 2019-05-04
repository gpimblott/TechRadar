"use strict";

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const security = require('../../utils/security.js');
const handler = require('../../handlers/api/commentApiHandler.js');

const ApiCommentRoutes = function () {
};

ApiCommentRoutes.createRoutes = function (self) {

    /**
     * Add a new comment for a technology
     */
    self.app.post('/api/comments', security.canAddComments, jsonParser, handler.addComment );

    /**
     * Delete comments
     */
    self.app.delete('/api/comments', security.isAuthenticatedAdmin, jsonParser, handler.deleteComment );

};

module.exports = ApiCommentRoutes;