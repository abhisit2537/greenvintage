'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  TwitterStrategy = require('passport-twitter').Strategy,
  users = require('../../controllers/users.server.controller');

module.exports = function (config) {
  // Use twitter strategy
  passport.use(new TwitterStrategy({
    consumerKey: config.twitter.clientID,
    consumerSecret: config.twitter.clientSecret,
    callbackURL: config.twitter.callbackURL,
    passReqToCallback: true
  },
  function (req, token, tokenSecret, profile, done) {
    // Set the provider data and include tokens
    var providerData = profile._json;
    providerData.token = token;
    providerData.tokenSecret = tokenSecret;

    // Create the user OAuth profile
    var displayname = profile.displayname.trim();
    var iSpace = displayname.indexOf(' '); // index of the whitespace following the firstname
    var firstname = iSpace !== -1 ? displayname.substring(0, iSpace) : displayname;
    var lastname = iSpace !== -1 ? displayname.substring(iSpace + 1) : '';

    var providerUserProfile = {
      firstname: firstname,
      lastname: lastname,
      displayname: displayname,
      username: profile.username,
      profileImageURL: profile.photos[0].value.replace('normal', 'bigger'),
      provider: 'twitter',
      providerIdentifierField: 'id_str',
      providerData: providerData
    };

    // Save the user OAuth profile
    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }));
};
