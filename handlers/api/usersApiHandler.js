var users = require('../../dao/users.js');
var User = require('../../models/User');

var security = require('../../utils/security.js');

var apiutils = require('./apiUtils.js');

var sanitizer = require('sanitize-html');
var crypto = require('crypto');
var userValidator  = require('../../shared/validators/userValidator.js');
var mailer = require('../../mailer/mailer');


var UsersApiHandler = function () {
};

/**
 * Get all categories
 */
UsersApiHandler.addUser = function (req, res) {
    var username = sanitizer(req.body.username);
    var email = sanitizer(req.body.email);
    var enabled = sanitizer(req.body.enabled);
    var password = sanitizer(req.body.password);
    var password2 = sanitizer(req.body.password2);

    var validationResult = userValidator.validateNewPassword(password, password2);
    validationResult = validationResult.valid ? userValidator.validateUsername(username) : validationResult;
    validationResult = validationResult.valid ? userValidator.validateEmail(email) : validationResult;

    if(enabled == 'undefined') { // happens when the sanitized value was undefined
        enabled = 'no';
    }

    if(!validationResult.valid) {
        res.writeHead(200, {"Content-Type": "application/json"});
        var data = {};
        data.error = validationResult.message;
        data.success = false;
        res.end(JSON.stringify(data));
        return;
    }

    users.add(
        new User(null, username, email, sanitizer(req.body.displayName),
            password, null, sanitizer(req.body.role), enabled),
        function (result, error) {
            apiutils.handleResultSet(res, result, error);
        });
};

UsersApiHandler.addUserSignUp = function(req, res){
    req.body.role = 1; // prevent other roles than "user" from being set
    req.body.enabled = 'no'; // new user accounts are disabled by default
    UsersApiHandler.addUser(req, res);
}

UsersApiHandler.updateProfile = function (req, res) {
    var oldPassword = sanitizer(req.body.oldPassword);
    var oldPasswordHash = crypto.createHash('sha256').update(oldPassword).digest('base64');
    var email = sanitizer(req.body.email);
    var password = sanitizer(req.body.password);
    var confirmPassword = sanitizer(req.body.confirmPassword);
    var displayName = sanitizer(req.body.displayname);
    var avatarData = "";

    if(req.file) {
        avatarData = req.file.buffer;
    }

    var validationResult = userValidator.validateNewPasswordChange(password, confirmPassword, oldPassword);
    validationResult = validationResult.valid ? userValidator.validateEmail(email) : validationResult;
    if(req.file && validationResult.valid) {
        validationResult = userValidator.validateAvatar(req.file);
    }
    if(!validationResult.valid) {
        apiutils.handleResultSet(res, null, validationResult.message);
        return;
    }

    users.findById(req.user.id, function (error, userFromDb) {
        if(error) {
            apiutils.handleResultSet(res, null, error);
        } else {
            if(password && userFromDb.password !== oldPasswordHash) {
                // user wants to change the password but the old one is incorrect
                apiutils.handleResultSet(res, null, "Old password is incorrect");
            } else {
                var passwordHash = userFromDb.password;
                if(password) {
                    passwordHash = crypto.createHash('sha256')
                        .update(password).digest('base64')
                }

                users.update(new User(req.user.id, userFromDb.username, email, displayName, passwordHash, avatarData, userFromDb.role, userFromDb.enabled), 
                    function (result, error) {
                        apiutils.handleResultSet(res, result , error);
                });
            }
        }
    });
};

UsersApiHandler.updateUser = function (req, res) {
    var userId = sanitizer(req.params.userId);
    var password = sanitizer(req.body.password);
    var email = sanitizer(req.body.email);
    var confirmPassword = sanitizer(req.body.confirmPassword);
    var displayName = sanitizer(req.body.displayname);
    var role = sanitizer(req.body.role);
    var enabled = sanitizer(req.body.enabled);
    var avatarData = null;

    if(req.file) {
        avatarData = req.file.buffer;
    }

    var validationResult = userValidator.validateNewPassword(password, confirmPassword);
    if(email && validationResult.valid) {
        validationResult = userValidator.validateEmail(email);
    }
    if(req.file && validationResult.valid) {
        validationResult = userValidator.validateAvatar(req.file);
    }
    if(!validationResult.valid) {
        apiutils.handleResultSet(res, null, validationResult.message);
        return;
    }

    users.findById(userId, function (error, userFromDb) {
        if(error) {
            apiutils.handleResultSet(res, null, error);
        } else {
            var passwordHash = userFromDb.password;
            if(password) {
                passwordHash = crypto.createHash('sha256')
                    .update(password).digest('base64')
            }
            if(!email) {
                email = userFromDb.email;
            }

            users.update(new User(userId, userFromDb.username, email, displayName, passwordHash, avatarData, role, enabled), function (result, error) {
                apiutils.handleResultSet(res, result, error);
            });
        }
    });
};

UsersApiHandler.getAllUsers = function (req, res) {
    users.getAll(function (result) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(result));
    });
};

UsersApiHandler.deleteUsers = function (req, res) {
    var data = req.body.id;

    users.delete(data, function(result, error) {
        apiutils.handleResultSet(res, result, error);
    });
};

UsersApiHandler.getAvatar = function (req, res) {
    var username = sanitizer(req.query.username);
    if(!username) {
        apiutils.handleResultSet(res, null, "Username parameter missing");
        return;
    }

    users.getAvatar(username, function(result, error) {
        var data = {};
        if (!error) {
            data.result = result.toString('base64');
            data.success = true;
        } else {
            data.error = error;
            data.success = false;
        }

        res.writeHead(200, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify(data));
    });
};

UsersApiHandler.generateResetPasswordCode = function (req, res) {
    var email = sanitizer(req.body.email);

    var validationResult = userValidator.validateEmail(email);
    if(!validationResult.valid) {
        apiutils.handleResultSet(res, null, validationResult.message);
        return;
    }

    var findByEmailCallback = function(error, user) {
        if(!user) {
            apiutils.handleResultSet(res, null, "Email not found");
        } else {
            crypto.randomBytes(48, function(err, buffer) {
                var token = buffer.toString('hex');
                var expireDate = new Date();
                expireDate.setHours(expireDate.getHours() + 1);

                users.addPasswordResetCode(user.id, token, expireDate, function(result, error) {
                    if(error) {
                        apiutils.handleResultSet(res, null, error);
                    } else {
                        var resetUrl = 'https://' + req.headers.host + "/user/resetpassword?resetCode=" + token;

                        mailer.sendEmail({
                            from: process.env.MAIL_FROM,
                            to: user.email,
                            subject: "TechRadar password reset request",
                            html: "<p>Hello <strong>" + (user.displayName || user.username) + "</strong>,</p>" +
                                "\n<p>We have received a request to reset your password. You can reset your password by following this link:</p>" +
                                "<p><a href='"+ resetUrl +"'>" + resetUrl + "</a></p>"
                        }, function (err, info) {
                            apiutils.handleResultSet(res, info, err);
                        });
                    }
                });
            });
        }
    };

    users.findByEmail(email, findByEmailCallback);
};

UsersApiHandler.resetPassword = function (req, res) {
    var resetCode = sanitizer(req.body.resetCode);
    var password = sanitizer(req.body.password);
    var confirmPassword = sanitizer(req.body.confirmPassword);

    var validationResult = userValidator.validateNewPassword(password, confirmPassword);
    if(!validationResult.valid) {
        apiutils.handleResultSet(res, null, validationResult.message);
        return;
    }

    var passwordHash = crypto.createHash('sha256').update(password).digest('base64');

    users.getUserByPasswordResetCode(resetCode, function(user, error) {
        if(!user) {
            apiutils.handleResultSet(res, null, "Invalid reset code");
        } else {
            users.update(user.id, user.email, user.displayName, passwordHash, null, user.role, user.enabled, function(result, error) {
                if(error) {
                    apiutils.handleResultSet(res, null, error);
                } else {
                    users.deleteResetCode(resetCode, function (delRes, error) {
                        if(delRes) {
                            console.log("Reset code " + resetCode + " deleted");
                        } else {
                            console.log("Cannot delete reset code");
                            console.log(error);
                        }
                        apiutils.handleResultSet(res, result, null);
                    });
                }
            });
        }
    });
};

module.exports = UsersApiHandler;
