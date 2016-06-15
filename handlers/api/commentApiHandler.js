var comments = require('../../dao/comments.js');
var apiutils = require('./apiUtils.js');
var sanitizer = require('sanitize-html');


var CommentApiHandler = function () {
};

CommentApiHandler.addComment = function (req, res) {

    comments.add(
        sanitizer(req.body.technology),
        sanitizer(req.body.comment),
        sanitizer(req.user.id),

        function (result, error) {
            apiutils.handleResultSet(res, result, error);
        });
};

CommentApiHandler.deleteComment = function (req, res) {
    var data = req.body.id;

    comments.delete(data, function (result, error) {
        apiutils.handleResultSet(res, result, error);
    })
};

module.exports = CommentApiHandler;