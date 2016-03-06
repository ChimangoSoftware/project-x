/// <reference path="./../../typings/tsd.d.ts" />

/**
 * Express configuration
 */

'use strict';

let express = require('express');
let favicon = require('serve-favicon');
let morgan = require('morgan');
let compression = require('compression');
let bodyParser = require('body-parser');
let methodOverride = require('method-override');
let cookieParser = require('cookie-parser');
let errorHandler = require('errorhandler');
let path = require('path');
let lusca = require('lusca');

let passport = require('passport');
let session = require('express-session');

let expressSequelizeSession = require('express-sequelize-session');

import config = require('./environment');
import sequelizeInstance = require('./sequelize-config');

var Store = expressSequelizeSession(session.Store);

module.exports = function(app) {
  var env = app.get('env');

  app.set('views', config.root + '/server/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(compression()); //-- https://github.com/expressjs/compression - attempt to compress response bodies for all request
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  //-- https://github.com/expressjs/method-override
  //-- Potencial para eliminar
  //- -Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
  app.use(methodOverride());

  app.use(cookieParser());

  // app.use(passport.initialize());

  // Persist sessions with sequelizeStore
  // We need to enable sessions for passport-twitter because it's an
  // oauth 1.0 strategy, and Lusca depends on sessions
  /*app.use(session({
    secret: config.secrets.session,
    saveUninitialized: true,
    resave: false,
    store: new Store(sequelizeInstance)
  }));*/


  /**
   * Lusca - express server security
   * https://github.com/krakenjs/lusca
   */
  /*if ('test' !== env) {
    app.use(lusca({
      csrf: {
        angular: true
      },
      xframe: 'SAMEORIGIN',
      hsts: {
        maxAge: 31536000, //1 year, in seconds
        includeSubDomains: true,
        preload: true
      },
      xssProtection: true
    }));
  }*/

  app.set('appPath', path.join(config.root, 'client'));

  //-- https://github.com/expressjs/morgan
  //-- HTTP request logger middleware for node.js

  if ('production' === env) {
    app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
    app.use(express.static(app.get('appPath')));
    app.use(morgan('dev'));
  }

  if ('development' === env) {
    app.use(require('connect-livereload')());
  }

  if ('development' === env || 'test' === env) {
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(app.get('appPath')));
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
};
