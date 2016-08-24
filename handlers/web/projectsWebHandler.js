var projects = require('../../dao/projects');
var technology = require('../../dao/technology');

var ProjectsWebHandler = function () {
};

ProjectsWebHandler.add = function (req, res) {
    res.render('pages/admin/addProject', {user: req.user});
};

ProjectsWebHandler.edit = function (req, res) {
    req.checkParams('projectId', 'Invalid project id').isInt();

    var errors = req.validationErrors();
    if (errors) {
        res.redirect('/error');
        return;
    }

    projects.findById(req.params.projectId, function (error, project) {
        if (error) {
            res.redirect('/error');
            return;
        } else {
            res.render('pages/admin/editProject', {user: req.user, project: project});
        }
    });
};

ProjectsWebHandler.addTechnology = function (req, res) {
    req.checkParams('projectId', 'Invalid project id').isInt();

    var errors = req.validationErrors();
    if (errors) {
        res.redirect('/error');
        return;
    }

    projects.findById(req.params.projectId, function (error, project) {
        if (error) {
            res.redirect('/error');
        } else {
            res.render('pages/addTechnologyToProject', {user: req.user, project: project});
        }
    });
};

ProjectsWebHandler.removeTechnology = function (req, res) {
    req.checkParams('projectId', 'Invalid project id').isInt();

    var errors = req.validationErrors();
    if (errors) {
        res.redirect('/error');
        return;
    }

    projects.findById(req.params.projectId, function (error, project) {
        if (error) {
            res.redirect('/error');
        } else {
            res.render('pages/removeTechnologyFromProject', {user: req.user, project: project});
        }
    });
};

ProjectsWebHandler.showRadar = function (req, res) {
    req.checkParams('projectId', 'Invalid project id').isInt();

    var errors = req.validationErrors();
    if (errors) {
        res.redirect('/error');
        return;
    }

    projects.findById(req.params.projectId, function (error, project) {

        if (error) {
            res.redirect('/error');
            return;
        } else {
            technology.getAllForProject(project.id, function (error, technologies) {
                if (error) {
                    res.redirect('/error');
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

    // check if a project name parameter has been specified
    var name = req.query.name;

    if( name==undefined) {
        res.render('pages/searchProjects', {user: req.user});
    } else {
        name = decodeURI(name);

        projects.findByName( name , function( error , project ) {
            if (error) {
                res.redirect('/error');
            } else {
                res.redirect('/project/' + project.id)
            }
        })
    }

};

module.exports = ProjectsWebHandler;