/// <reference path="./../../typings/tsd.d.ts" />

import express = require('express');
import passport = require('passport');
let favicon = require('serve-favicon');
// HTTP request logger middleware for node.js - https://github.com/expressjs/morgan
let morgan = require('morgan');
// attempt to compress response bodies for all request - https://github.com/expressjs/compression
let compression = require('compression');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let path = require('path');
// Web application security middleware.
// let lusca = require('lusca');
// session
let session = require('express-session');
let expressSequelizeSession = require('express-sequelize-session');

import config = require('./environment');
import sequelizeInstance = require('./sequelize-config');

var Store = expressSequelizeSession(session.Store);

module.exports = function(app) {
    var env = app.get('env');

    app.set('views', config.root + '/server/views');
    app.set('appPath', path.join(config.root, 'client'));
    app.set('view engine', 'html');

    app.engine('html', require('ejs').renderFile);

    app.use(compression());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(passport.initialize());
    // Persist sessions with sequelizeStore
    // We need to enable sessions for passport-twitter because it's an
    // oauth 1.0 strategy, and Lusca depends on sessions
    app.use(session({
        secret: config.secrets.session,
        saveUninitialized: true,
        resave: false,
        store: new Store(sequelizeInstance)
    }));
    app.use(morgan('dev'));

    /**
     * Lusca - express server security
     * https://github.com/krakenjs/lusca
     */
    /*if ('test' !== env) {
        app.use(lusca({
            csrf: { angular: true },
            xframe: 'SAMEORIGIN',
            hsts: {
                maxAge: 31536000, // 1 year, in seconds
                includeSubDomains: true,
                preload: true
            },
            xssProtection: true
        }));
    }*/
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
