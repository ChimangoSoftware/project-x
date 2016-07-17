/// <reference path="./../../typings/index.d.ts" />

import express = require('express');
import passport = require('passport');

const auth0Strategy = require('../auth/passport/auth0');

const favicon = require('serve-favicon');
// HTTP request logger middleware for node.js - https://github.com/expressjs/morgan
const morgan = require('morgan');
// attempt to compress response bodies for all request - https://github.com/expressjs/compression
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session');

import config = require('./environment');
import sequelizeInstance = require('./sequelize-config');

module.exports = function (app) {
    var env = app.get('env');

    app.set('views', config.root + '/server/views');
    app.set('appPath', path.join(config.root, 'client'));
    app.set('view engine', 'html');

    app.engine('html', require('ejs').renderFile);

    app.use(compression());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(session({
        secret: 'UATp275fRiBckAd438bFCURhmyYO1EUqTe1v2EuHN7QmZzHBed_U4eeTww7eLPsj',
        resave: false,
        saveUninitialized: false
    }));

    // passport
    app.use(passport.initialize());
    app.use(passport.session());

    if ('production' === env) {
        app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
        app.use(express.static(app.get('appPath')));
    }
    if ('development' === env) {
        // creo q hay q eliminarlo...
        app.use(require('connect-livereload')());
    }
    if ('development' === env || 'test' === env) {
        let errorHandler = require('errorhandler');

        app.use(express.static(path.join(config.root, '.tmp')));
        app.use(express.static(app.get('appPath')));

        app.use(errorHandler());
    }
};
