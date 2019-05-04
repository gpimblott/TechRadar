"use strict";

const comments = require('../../dao/comments.js');
const apiutils = require('./apiUtils.js');
const sanitizer = require('sanitize-html');


const CommentApiHandler = function () {
};

CommentApiHandler.addComment = function (req, res) {

    comments.add(
        sanitizer(req.body.technology),
        sanitizer(req.body.comment),
        sanitizer(req.user.id),
        sanitizer(req.body.software_version_id),

        function (result, error) {
            apiutils.handleResultSet(res, result, error);
        });
};

CommentApiHandler.deleteComment = function (req, res) {
    const data = req.body.id;

    comments.delete(data, function (result, error) {
        apiutils.handleResultSet(res, result, error);
    })
};

module.exports = CommentApiHandler;