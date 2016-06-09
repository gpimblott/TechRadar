var projects = require('../../dao/projects');
var technology = require('../../dao/technology');

var ProjectsWebHandler = function () {
};

ProjectsWebHandler.add = function (req, res) {
    res.render('pages/admin/addProject', {user: req.user});
};

ProjectsWebHandler.edit = function (req, res) {
    projects.findById(req.params.projectId, function (error, project) {
        if (error) {
            res.render('pages/error', {user: req.user});
        } else {
            res.render('pages/admin/editProject', {user: req.user, project: project});
        }
    });
};

ProjectsWebHandler.addTechnology = function (req, res) {
    projects.findById(req.params.projectId, function (error, project) {
        if (error) {
            res.render('pages/error', {user: req.user});
        } else {
            res.render('pages/addTechnologyToProject', {user: req.user, project: project});
        }
    });
};

ProjectsWebHandler.removeTechnology = function (req, res) {
    projects.findById(req.params.projectId, function (error, project) {
        if (error) {
            res.render('pages/error', {user: req.user});
        } else {
            res.render('pages/removeTechnologyFromProject', {user: req.user, project: project});
        }
    });
};

ProjectsWebHandler.showRadar = function (req, res) {
    projects.findById(req.params.projectId, function (error, project) {

        if (error) {
            res.render('pages/error', {user: req.user});
        } else {
            technology.getAllForProject(project.id, function (error, technologies) {
                if (error) {
                    res.render('pages/error', {user: req.user});
                } else {
                    res.render('pages/projectRadar', {
                        user: req.user,
                        project: project,
                        technologies: technologies
                    });
                }
            });
        }
    });
};

ProjectsWebHandler.list = function (req, res) {
    res.render('pages/listProjects', {user: req.user});
};

module.exports = ProjectsWebHandler;