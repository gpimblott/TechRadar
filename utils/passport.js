'use strict';

/**
 * Configure passport for simple database authentication
 */
const passport = require('passport');
const bunyan = require('bunyan');
const LocalStrategy = require('passport-local').Strategy;
const users = require('../dao/users.js');
const User = require('../models/User.js');

if (process.env.AZURE_IDENTITY_METADATA) {
  var config = require('./configAzureAD');
  var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

  var strategyConfig = {
    callbackURL: config.creds.returnURL,
    realm: config.creds.realm,
    clientID: config.creds.clientID,
    clientSecret: config.creds.clientSecret,
    oidcIssuer: config.creds.issuer,
    identityMetadata: config.creds.identityMetadata,
    scope: config.creds.scope,
    skipUserProfile: config.creds.skipUserProfile,
    responseType: config.creds.responseType,
    responseMode: config.creds.responseMode,
    validateIssuer: config.creds.validateIssuer,
    passReqToCallback: config.creds.passReqToCallback,
    loggingLevel: config.creds.loggingLevel
  };
}

var log = bunyan.createLogger({
  name: 'AnswerIt - passport.js',
  streams: [ {
    stream: process.stderr,
    level: "error",
    name: "error"
  }, {
    stream: process.stdout,
    level: "warn",
    name: "console"
  } ]
});



// Used by non-ADFS users
passport.use(new LocalStrategy(
  function (username, password, cb) {
    users.findByUsername(username, function (err, user) {

      if (err) {
        return cb(err);
      }
      if (!user) {
        return cb(null, false, { message: 'Incorrect login' });
      }

      if (!user.enabled) {
        return cb(null, false, {
          message: `Account disabled. Please contact the platform administrator to activate this account.`
        });
      }

      var userHash = require('crypto').createHash('sha256').update(password).digest('base64');

      if (user.password != userHash) {
        return cb(null, false, { message: 'Incorrect login' });
      }
      return cb(null, user);
    });
  }));

if (process.env.AZURE_IDENTITY_METADATA) {

  if (strategyConfig.loggingLevel) { log.levels("console", strategyConfig.loggingLevel); }

  // Used by ADFS users
  passport.use(new OIDCStrategy(strategyConfig,
    function (profile, done) {
      // Depending on the type of the account e.g. registered in live.com or kainos.com
      // user's email may be returned in "unique_name" field instead of "email"
      var email = profile._json.email || profile._json.unique_name
      if (!email) {
        return done(new Error("No email found"), null);
      }

      process.nextTick(function () {
        // ADFS user's username is set to the email used in the authentication process
        users.findByUsername(email, function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            registerUserUsingProfileData(profile._json, function (err, user) {
              if (err) {
                return done(err);
              }
              log.info("A new user has been created. Email: " + user.email);
              return done(null, user);
            });
          }
          else if (!user.enabled) {
            return done(null, false);
          }
          else {
            log.info("An existing user is logging in using email: " + user.email);
            log.debug(user);
            return done(null, user);
          }
        });
      });
    }
  ));

  /**
   * Reads profile data sent by Azure AD and persists the user in the DB
   * @param  {Object}   profileJson Azure AD profile data such as email, unique_name, etc.
   * @param  {Function} done        Callback function that returns the user from our DB or an error
   */
  function registerUserUsingProfileData (profileJson, done) {
    log.info("Registering a new user with email: " + profileJson.email);
    var email = profileJson.email || profileJson.unique_name;
    // password is required, so we need to provide one even when the true password is handled by ADFS
    var randomPassword = require('crypto').randomBytes(256).toString();
    var newUser = new User(null, profileJson.unique_name, email, profileJson.name, randomPassword, null, 2, true);
    users.add(newUser, function (userId, error) {
      log.info("Getting user with id = " + userId + " from the database");
      users.findById(userId, function (err, user) {
        if (err) {
          return done(err, null);
        }
        return done(null, user);
      });
      if (error) {
        log.error(error);
      }
    });
  }
}

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