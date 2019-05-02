const comments = require('../../dao/comments');
const technology = require('../../dao/technology');
const markdown = require( "markdown" ).markdown;


const PAGE_SIZE = 10;

const CommentsWebHandler = function () {
};

CommentsWebHandler.add = function (req, res) {
    req.checkParams('id', 'Invalid comment id').isInt();

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

    const errors = req.validationErrors();
    if (errors) {
        res.redirect('/error');
        return;
    }

    const techId = req.params.technologyId;
    const pageNumber = req.params.page;
    comments.getForTechnology(techId, pageNumber, PAGE_SIZE, function (result,error) {
        comments.getCountForTechnology(techId, function (countData) {

            result.forEach( (item)=>{
                item.text = markdown.toHTML(item.text);
            });

            res.render('partials/comments', {
                comments:  result,
                user: req.user,
                count: countData.count,
                pageSize: PAGE_SIZE,
                currentPage: pageNumber,
                technologyId: techId
            });
        });
    });
};

module.exports = CommentsWebHandler;