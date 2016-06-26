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
    res.render('pages/searchTechnologies', {user: req.user});
};

TechnologiesWebHandler.add = function (req, res) {
    res.render('pages/addTechnology', {categories: cache.getCategories(), user: req.user});
};

TechnologiesWebHandler.edit = function (req, res) {
    req.checkParams('id', 'Invalid technology id').isInt();

    var errors = req.validationErrors();
    if (errors) {
        res.redirect('/error');
        return;
    }

    var num = req.params.id;
    technology.getById(req.user.id, num, function (value) {
        if (value == null || value.length == 0 || value.length > 1) {
            res.redirect('/error');
            return;
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
    req.checkParams('id', 'Invalid technology id').isInt();

    var errors = req.validationErrors();
    if (errors) {
        res.redirect('/error');
        return;
    }

     
    var num = req.params.id;
    console.log("Router : getTechnology:" + num);

    technology.getById(req.user.id, num, function (value) {
        if (value == null || value.length == 0 || value.length > 1) {
            console.log("getById error");
            res.redirect('/error');
        } else {
            console.log("Router : getTechnology Rendering page");
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
    req.checkParams('id', 'Invalid technology id').isInt();

    var errors = req.validationErrors();
    if (errors) {
        res.redirect('/error');
        return;
    }

    var techid = req.params.id;

    technology.getById(req.user.id, techid, function (value) {

        if (value == null || value.length == 0) {
            res.redirect('/error');
            return;
        }

        res.render('pages/statushistory',
            {
                technology: value,
                user: req.user
            });
    });
};

TechnologiesWebHandler.getVotes = function (req, res) {
    req.checkParams('id', 'Invalid technology id').isInt();

    var errors = req.validationErrors();
    if (errors) {
        res.redirect('/error');
        return;
    }

    var techid = req.params.id;

    technology.getById(req.user.id, techid, function (value) {

        if (value == null || value.length == 0) {
            res.redirect('/error');
            return;
        }

        res.render('pages/votehistory',
            {
                technology: value,
                user: req.user
            });
    });
};

TechnologiesWebHandler.updateStatus = function (req, res) {
    req.checkParams('id', 'Invalid technology id').isInt();

    var errors = req.validationErrors();
    if (errors) {
        res.redirect('/error');
        return;
    }

    var techid = req.params.id;

    technology.getById(req.user.id, techid, function (value) {
        if (value == null || value.length == 0) {
            res.redirect('/error');
            return;
        }

        var statuses = cache.getStatuses();
        res.render('pages/updateStatus',
            {
                technology: value,
                user: req.user,
                statuses: statuses
            });
    });
};

TechnologiesWebHandler.addProject = function (req, res) {
    req.checkParams('id', 'Invalid technology id').isInt();

    var errors = req.validationErrors();
    if (errors) {
        res.redirect('/error');
        return;
    }

    var techid = req.params.id;

    technology.getById(req.user.id, techid, function (technology) {
        if (technology === null) {
            res.redirect('/error');
            return;
        } else {
            project.getAllForTechnology(techid, function (linkedProjects) {
                
                project.getAll(function (allProjects) {
                    res.render('pages/addProjectToTechnology',
                        {
                            technology: technology,
                            user: req.user,
                            unassignedProjects: allProjects.filter(function (e) {
                                return linkedProjects.map(function (linkedEl) {
                                        return linkedEl.id
                                    }).indexOf(e.id) === -1;
                            })
                        });
                });
            });
        }
    });
};

module.exports = TechnologiesWebHandler;