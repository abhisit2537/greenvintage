'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  GithubStrategy = require('passport-github').Strategy,
  users = require('../../controllers/users.server.controller');

module.exports = function (config) {
  // Use github strategy
  passport.use(new GithubStrategy({
    clientID: config.github.clientID,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackURL,
    passReqToCallback: true
  },
  function (req, accessToken, refreshToken, profile, done) {
    // Set the provider data and include tokens
    var providerData = profile._json;
    providerData.accessToken = accessToken;
    providerData.refreshToken = refreshToken;

    // Create the user OAuth profile
    var displayname = profile.displayname ? profile.displayname.trim() : profile.username.trim();
    var iSpace = displayname.indexOf(' '); // index of the whitespace following the firstname
    var firstname = iSpace !== -1 ? displayname.substring(0, iSpace) : displayname;
    var lastname = iSpace !== -1 ? displayname.substring(iSpace + 1) : '';

    var providerUserProfile = {
      firstname: firstname,
      lastname: lastname,
      displayname: displayname,
      email: profile.emails[0].value,
      username: profile.username,
      // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
      profileImageURL: (providerData.avatar_url) ? providerData.avatar_url : undefined,
      // jscs:enable
      provider: 'github',
      providerIdentifierField: 'id',
      providerData: providerData
    };

    // Save the user OAuth profile
    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }));
};
