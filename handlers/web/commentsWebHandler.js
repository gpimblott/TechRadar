"use strict";

const comments = require('../../dao/comments');
const technology = require('../../dao/technology');
const markdown = require( "markdown" ).markdown;

const PAGE_SIZE = 10;

const CommentsWebHandler = function () {
};

/**
 * Add a comment to a technology
 * @param req
 * @param res
 */
CommentsWebHandler.add = function (req, res) {
    req.checkParams('id', 'Invalid comment id').isInt();

    const errors = req.validationErrors();
    if (errors) {
        res.redirect('/error');
        return;
    }

    const num = req.params.id;
    technology.getById(req.user.id, num, function (value) {
        res.render('pages/addComment', {technology: value, user: req.user});
    });
};

/**
 * Display the comments for a technology
 * @param req
 * @param res
 */
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