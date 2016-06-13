var comments = require('../../dao/comments');
var technology = require('../../dao/technology');
var sanitizer = require('sanitize-html');

var PAGE_SIZE = 10;

var CommentsWebHandler = function () {
};

CommentsWebHandler.add = function (req, res) {
    var num = req.params.id;
    technology.getById(num, function (value) {
        res.render('pages/addComment', {technology: value, user: req.user});
    });
};

CommentsWebHandler.commentsForTechnology = function (req, res) {
    var techid = sanitizer(req.params.technologyId);
    var pageNumber = sanitizer(req.params.page);
    comments.getForTechnology(techid, pageNumber, PAGE_SIZE, function (result) {
        comments.getCountForTechnology(techid, function (countData) {
            res.render('partials/comments', {
                comments: result,
                user: req.user,
                count: countData.count,
                pageSize: PAGE_SIZE,
                currentPage: pageNumber,
                technologyId: techid
            });
        });
    });
};

module.exports = CommentsWebHandler;