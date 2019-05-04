"use strict";

const users = require('../../dao/users.js');
const User = require('../../models/User');
const apiutils = require('./apiUtils.js');

const sanitizer = require('sanitize-html');
const crypto = require('crypto');
const userValidator  = require('../../shared/validators/userValidator.js');
const mailer = require('../../mailer/mailer');


const UsersApiHandler = function () {
};

/**
 * Add a new User
 */
UsersApiHandler.addUser = function (req, res) {
    const username = sanitizer(req.body.username);
    const email = sanitizer(req.body.email);
    let enabled = sanitizer(req.body.enabled);
    const password = sanitizer(req.body.password);
    const password2 = sanitizer(req.body.password2);

    let validationResult = userValidator.validateNewPassword(password, password2);
    validationResult = validationResult.valid ? userValidator.validateUsername(username) : validationResult;
    validationResult = validationResult.valid ? userValidator.validateEmail(email) : validationResult;

    if(enabled === 'undefined') { // happens when the sanitized value was undefined
        enabled = 'no';
    }

    if(!validationResult.valid) {
        res.writeHead(200, {"Content-Type": "application/json"});
        const data = {};
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
};

/**
 * Update user profile
 * @param req
 * @param res
 */
UsersApiHandler.updateProfile = function (req, res) {
    const oldPassword = sanitizer(req.body.oldPassword);
    const oldPasswordHash = crypto.createHash('sha256').update(oldPassword).digest('base64');
    const email = sanitizer(req.body.email);
    const password = sanitizer(req.body.password);
    const confirmPassword = sanitizer(req.body.confirmPassword);
    const displayName = sanitizer(req.body.displayname);
    let avatarData = "";

    if(req.file) {
        avatarData = req.file.buffer;
    }

    let validationResult = userValidator.validateNewPasswordChange(password, confirmPassword, oldPassword);
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
                let passwordHash = userFromDb.password;
                if(password) {
                    passwordHash = crypto.createHash('sha256').update(password).digest('base64')
                }

                users.update(new User(req.user.id, userFromDb.username, email, displayName, passwordHash, avatarData, userFromDb.role, userFromDb.enabled), 
                    function (result, error) {
                        apiutils.handleResultSet(res, result , error);
                });
            }
        }
    });
};

/**
 * Update the user details
 * @param req
 * @param res
 */
UsersApiHandler.updateUser = function (req, res) {
    const userId = sanitizer(req.params.userId);
    const password = sanitizer(req.body.password);
    const confirmPassword = sanitizer(req.body.confirmPassword);
    const displayName = sanitizer(req.body.displayname);
    const role = sanitizer(req.body.role);
    const enabled = sanitizer(req.body.enabled);

    let email = sanitizer(req.body.email);

    let avatarData = null;

    if(req.file) {
        avatarData = req.file.buffer;
    }

    let validationResult = userValidator.validateNewPassword(password, confirmPassword);
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
            let passwordHash = userFromDb.password;
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
    const data = req.body.id;

    users.delete(data, function(result, error) {
        apiutils.handleResultSet(res, result, error);
    });
};

UsersApiHandler.getAvatar = function (req, res) {
    const username = sanitizer(req.query.username);
    if(!username) {
        apiutils.handleResultSet(res, null, "Username parameter missing");
        return;
    }

    users.getAvatar(username, function(result, error) {
        const data = {};
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
    const email = sanitizer(req.body.email);

    const validationResult = userValidator.validateEmail(email);
    if(!validationResult.valid) {
        apiutils.handleResultSet(res, null, validationResult.message);
        return;
    }

    const findByEmailCallback = function(error, user) {
        if(!user) {
            apiutils.handleResultSet(res, null, "Email not found");
        } else {
            crypto.randomBytes(48, function(err, buffer) {
                const token = buffer.toString('hex');
                const expireDate = new Date();
                expireDate.setHours(expireDate.getHours() + 1);

                users.addPasswordResetCode(user.id, token, expireDate, function(result, error) {
                    if(error) {
                        apiutils.handleResultSet(res, null, error);
                    } else {
                        const resetUrl = 'https://' + req.headers.host + "/user/resetpassword?resetCode=" + token;

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
    const resetCode = sanitizer(req.body.resetCode);
    const password = sanitizer(req.body.password);
    const confirmPassword = sanitizer(req.body.confirmPassword);

    const validationResult = userValidator.validateNewPassword(password, confirmPassword);
    if(!validationResult.valid) {
        apiutils.handleResultSet(res, null, validationResult.message);
        return;
    }

    const passwordHash = crypto.createHash('sha256').update(password).digest('base64');

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
