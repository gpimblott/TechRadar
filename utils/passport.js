/**
 * Configure passport for simple database authentication
 */
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const users = require('../dao/users.js');


passport.use(new Strategy(
    function (username, password, cb) {
        users.findByUsername(username, function (err, user) {

            if (err) {
                return cb(err);
            }
            if (!user) {
                return cb(null, false, { message: 'Incorrect login'});
            }

            var userHash = require('crypto').createHash('sha256').update(password).digest('base64');

            if (user.password != userHash) {
                return cb(null, false, { message: 'Incorrect login'});
            }
            return cb(null, user);
        });
    }));

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    users.findById(id, function (err, user) {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});
