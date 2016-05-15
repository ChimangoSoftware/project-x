import passport = require('passport');
import passportLocal = require('passport-local');
let LocalStrategy = require('passport-local').Strategy;

import sequelizeInstance = require('../../config/sequelize-config');
import UserDao from '../../api/user/user.dao';

function localAuthenticate(email: string, password: string, done: Function) {
    let User = new UserDao(sequelizeInstance);

    User.find({ where: { email: email.toLowerCase() } }, (err, user) => {
        if (err) { done(err); }
        if (!user) {
            return done(null, false, { message: 'This email is not registered.' });
        }
        user.authenticate(password, function (authError, authenticated) {
            if (authError) {
                return done(authError);
            }
            if (!authenticated) {
                return done(null, false, { message: 'This password is not correct.' });
            } else {
                return done(null, user);
            }
        });
    });
}

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password' // this is the virtual field on the model
    }, function (email: string, password: string, done: Function) {
        return localAuthenticate(email, password, done);
    }));
};
