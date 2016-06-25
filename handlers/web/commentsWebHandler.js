var comments = require('../../dao/comments');
var technology = require('../../dao/technology');

var PAGE_SIZE = 10;

var CommentsWebHandler = function () {
};

CommentsWebHandler.add = function (req, res) {
    req.checkParams('id', 'Invalid comment id').isInt();

    console.log("Add comment ????");

    var errors = req.validationErrors();
    if (errors) {
        res.redirect('/error');
        return;
    }

    var num = req.params.id;
    technology.getById(req.user.id, num, function (value) {
        res.render('pages/addComment', {technology: value, user: req.user});
    });
};

CommentsWebHandler.commentsForTechnology = function (req, res) {
    req.checkParams('technologyId', 'Invalid technology id').isInt();
    req.checkParams('page', 'Invalid page number').isInt();

    console.log("commentsForTechnology");

    var errors = req.validationErrors();
    if (errors) {
        res.redirect('/error');
        return;
    }

    console.log("commentsForTechnology-2");


    var techid = req.params.technologyId;
    var pageNumber = req.params.page;
    comments.getForTechnology(techid, pageNumber, PAGE_SIZE, function (result,error) {
        console.log("Got technology");
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