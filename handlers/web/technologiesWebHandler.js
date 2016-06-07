var cache = require('../../dao/cache.js');
var users = require('../../dao/users');
var comments = require('../../dao/comments');
var project = require('../../dao/projects');
var technology = require('../../dao/technology');

var TechnologiesWebHandler = function () {
};

TechnologiesWebHandler.listTechnologies = function (req, res) {
    res.render('pages/admin/listTechnologies', {user: req.user});
};

TechnologiesWebHandler.search = function (req, res) {
    res.render('pages/search', {user: req.user});
};

TechnologiesWebHandler.add = function (req, res) {
    res.render('pages/addTechnology', {categories: cache.getCategories(), user: req.user});
};

TechnologiesWebHandler.edit = function (req, res) {
    var num = req.params.id;
    technology.getById(num, function (value) {
        if (value.length == 0 || value.length > 1) {
            res.render('pages/error', {user: req.user});
        } else {

            var statuses = cache.getStatuses();
            res.render('pages/editTechnology',
                {
                    technology: value,
                    user: req.user,
                    statuses: statuses
                });
        }
    });
};

TechnologiesWebHandler.getTechnology = function (req, res) {
    var num = req.params.id;
    technology.getById(num, function (value) {
        if (value.length == 0 || value.length > 1) {
            res.render('pages/error', {user: req.user});
        } else {
            var statuses = cache.getStatuses();
            res.render('pages/technology',
                {
                    technology: value,
                    user: req.user,
                    statuses: statuses
                });
        }
    });
};

TechnologiesWebHandler.getStatusHistory = function (req, res) {
    var techid = req.params.id;

    technology.getById(techid, function (value) {
        res.render('pages/statushistory',
            {
                technology: value,
                user: req.user
            });
    });
};

TechnologiesWebHandler.getVotes = function (req, res) {
    var techid = req.params.id;

    technology.getById(techid, function (value) {
        res.render('pages/votehistory',
            {
                technology: value,
                user: req.user
            });
    });
};

TechnologiesWebHandler.updateStatus = function (req, res) {
    var techid = req.params.id;

    technology.getById(techid, function (value) {
        var statuses = cache.getStatuses();
        res.render('pages/admin/updateStatus',
            {
                technology: value,
                user: req.user,
                statuses: statuses
            });
    });
};

TechnologiesWebHandler.addProject = function (req, res) {
    var techid = req.params.id;

    technology.getById(techid, function (technology) {
        if (technology === null) {
            res.render('pages/error', {user: req.user});
        } else {
            project.getAllForTechnology(techid, function (linkedProjects) {
                project.getAll(function (allProjects) {
                    res.render('pages/admin/addProjectToTechnology',
                        {
                            technology: technology,
                            user: req.user,
                            unassignedProjects: allProjects.filter(function (e) {
                                return linkedProjects.map(function(linkedEl) {return linkedEl.id}).indexOf(e.id) === -1;
                            })
                        });
                });
            });
        }
    });
};

module.exports = TechnologiesWebHandler;