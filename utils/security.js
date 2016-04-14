
var Security = function () {
};


/**
 * Check if the users is authenticated
 */
Security.isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    req.session.redirect_to = req.url;
    res.redirect('/login');
}

Security.isAuthenticatedAdmin = function (req, res, next) {
    if (req.isAuthenticated() && req.user.admin)
        return next();
    req.session.redirect_to = req.url;
    res.redirect('/login');
}


module.exports=Security;