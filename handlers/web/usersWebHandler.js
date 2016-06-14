var users = require('../../dao/users');

var UsersWebHandler = function () {
};

UsersWebHandler.list = function (req, res) {
    res.render('pages/admin/user/listUsers', {user: req.user});
};

UsersWebHandler.add = function (req, res) {
    res.render('pages/admin/user/addUser', {user: req.user});
};

UsersWebHandler.editProfile = function (req, res) {
    res.render('pages/editProfile', {user: req.user, editUser: req.user});
};

UsersWebHandler.editUser = function (req, res) {
    req.checkParams('userId', 'Invalid user id').isInt();

    var errors = req.validationErrors();
    if (errors) {
        res.redirect('/error');
        return;
    }

    users.findById(req.params.userId, function (error, editUser) {
        if (error) {
            res.redirect_to('/error');
            return;
        } else {
            res.render('pages/admin/user/editUser', {user: req.user, editUser: editUser});
        }
    });

};


module.exports = UsersWebHandler;