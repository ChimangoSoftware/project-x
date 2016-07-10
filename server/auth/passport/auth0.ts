var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

var strategy = new Auth0Strategy({
    domain:       'chimango.auth0.com',
    clientID:     'ivo2sgc4HRnRF8ug9ulVGsCpkRJg0Tc0',
    clientSecret: 'UATp275fRiBckAd438bFCURhmyYO1EUqTe1v2EuHN7QmZzHBed_U4eeTww7eLPsj',
    callbackURL:  '/login'
  }, function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
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