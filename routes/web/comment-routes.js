var comments = require('../../dao/comments');
var security = require('../../utils/security.js');
var sanitizer = require('sanitize-html');

var PAGE_SIZE = 10;

var CommentRoutes = function () {
};


CommentRoutes.createRoutes = function (self) {

    /**
     * Add a new comment for technology page
     */
    self.app.get('/comments/add/:id', security.isAuthenticated,
        function (req, res) {
            var num = req.params.id;
            technology.getById(num, function (value) {
                res.render('pages/addComment', {technology: value, user: req.user});
            });
        });

    /**
     * Comment page partial
     */
    self.app.get('/comments/:technologyId/:page', security.isAuthenticated,
        function (req, res) {
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

        });


};


module.exports = CommentRoutes;