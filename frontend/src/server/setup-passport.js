var passport = require('passport');
var Auth0Strategy = require('passport-auth0');
var appConfig = require('./../../config/main.js');

var strategy = new Auth0Strategy({
    domain:       appConfig.auth0.domain,
    clientID:     appConfig.auth0.clientId,
    clientSecret: appConfig.auth0.secret,
    callbackURL:  '/login',
    scope: 'openid email offline_access'
  }, function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user

    // Le agrego el token para después usarlo en las llamadas a la api
    Object.assign(profile, {
      token: extraParams.id_token,
      refreshToken
    });

    return done(null, profile);
  });

passport.use(strategy);

// This is not a best practice, but we want to keep things simple for now
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = strategy;
