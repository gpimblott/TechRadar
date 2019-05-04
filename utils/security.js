"use strict";

/**
 * Security helper functions
 */
const Security = function () {
};


/**
 * Check if the users is authenticated
 *
 * If not the target url is stored in the session and the user is redirected to the login page
 *
 */
Security.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        req.user.canEdit = (req.user.admin || req.user.rolename === 'author');
        req.user.canComment = (req.user.admin || req.user.rolename === 'author' || req.user.rolename === 'reviewer');

        return next();
    }

    req.session.redirect_to = req.url;
    res.redirect('/login');
};

/**
 * Check if the users is an authenticated admin
 *
 * If not the target url is stored in the session and the user is redirected to the login page
 */
Security.isAuthenticatedAdmin = function (req, res, next) {
    if (req.isAuthenticated() && req.user.admin) {
        req.user.canEdit = true;
        req.user.canComment = true;
        return next();
    }

    req.session.redirect_to = req.url;
    res.redirect('/login');
};

/**
 * All authenticated users apart from 'users' can add comments
 */
Security.canAddComments = function (req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.admin || req.user.rolename === 'author' || req.user.rolename === 'reviewer') {
            req.user.canEdit = req.user.rolename === 'author';
            req.user.canComment = true;
            return next();
        } else {
            res.redirect('/error');
        }
    }

    req.session.redirect_to = req.url;
    res.redirect('/login');
};

/**
 * Admins and authors can edit data
 */
Security.canEdit = function (req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.admin || req.user.rolename === 'author') {
            req.user.canEdit = true;
            req.user.canComment = true;
            return next();
        } else {
            res.redirect('/error');
        }
    }

    req.session.redirect_to = req.url;
    res.redirect('/login');
};


module.exports = Security;