const appConfig = require('../config/main');

import * as e6p from 'es6-promise';
(e6p as any).polyfill();
import 'isomorphic-fetch';

import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';

import { Provider } from 'react-redux';
import { createMemoryHistory, match } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
const { ReduxAsyncConnect, loadOnServer } = require('redux-connect');
import { configureStore } from './app/redux/store';
import routes from './app/routes';

import { Html } from './app/containers';
const manifest = require('../build/manifest.json');

const express = require('express');
const path = require('path');
const compression = require('compression');
const Chalk = require('chalk');
const favicon = require('serve-favicon');
const passport = require('passport');
const session = require('express-session');
const request = require('request');
const RedisStore = require('connect-redis')(session);
const bodyParser = require('body-parser');

// This will configure Passport to use Auth0
require('./server/setup-passport');
const cookieParser = require('cookie-parser');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut();

const app = express();

app.use(compression());

app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
  store: new RedisStore({
    host: appConfig.redis.host,
    port: appConfig.redis.port,
  }),
  secret: appConfig.auth0.secret,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const webpackConfig = require('../config/webpack/dev');
  const webpackCompiler = webpack(webpackConfig);

  app.use(require('webpack-dev-middleware')(webpackCompiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: { colors: true },
    noInfo: true,
    hot: true,
    inline: true,
    lazy: false,
    historyApiFallback: true,
    quiet: true,
  }));

  app.use(require('webpack-hot-middleware')(webpackCompiler));
}

app.use(favicon(path.join(__dirname, '../src/favicon.ico')));

app.use('/public', express.static(path.join(__dirname, '../build/public')));

app.get('/login',
  ensureLoggedOut,
  passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
  (req, res) => {
    res.redirect(req.session.returnTo || '/');
  }
);

app.get('/logout', ensureLoggedIn, (req, res) => {
  req.logout();
  res.redirect('/login');
});

app.get('/user', ensureLoggedIn, (req, res) => {
  res.status(200).send(req.user);
});

app.post('/api', ensureLoggedIn, (req, res) => {
  const options = {
    url : `${appConfig.api.host}:${appConfig.api.port}/api/service`,
    json: req.body,
    headers: {
      Authorization: 'Bearer ' + req.user.token,
    },
  };

  const callApi = (options) => {
    request.post(options, (err, response, body) => {
      if (err) {
        console.log(err);
      }

      if (response.statusCode === 401) {
        // token expired, logout to generate a new one
        req.logout();

        // The token expired, generate a new token using
        // the refresh token and retry the call
        // console.log('Token expired. Trying to refresh the token');
        // auth0.refreshToken(req.user.refreshToken, (err, delegationResult) => {
        //   console.log('Token refreshed:', delegationResult.id_token);
        //   req.user.token = delegationResult.id_token;
        //   req.login(req.user, (err) => {
        //     if (!err) {
        //       return callApi(options);
        //     }
        //   });
        // });
      }

      res.send(body);
    });
  };

  callApi(options);
});

app.get('*',
  ensureLoggedIn,
  (req, res) => {

  const location = req.url;
  const memoryHistory = createMemoryHistory(req.originalUrl);
  const store = configureStore(memoryHistory);
  const history = syncHistoryWithStore(memoryHistory, store);

  match({ history, routes, location },
    (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send(error.message);
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        const asyncRenderData = Object.assign({}, renderProps, { store });

        loadOnServer(asyncRenderData).then(() => {
          const markup = ReactDOMServer.renderToString(
            <Provider store={store} key="provider">
              <ReduxAsyncConnect {...renderProps} />
            </Provider>
          );
          res.status(200).send(renderHTML(markup));
        });

        function renderHTML(markup) {
          const html = ReactDOMServer.renderToString(
            <Html markup={markup} manifest={manifest} store={store} />
          );

          return `<!doctype html> ${html}`;
        }
      } else {
        res.status(404).send('Not Found?');
      }
    });
});

app.listen(appConfig.port, appConfig.host, err => {
  if (err) {
    console.error(Chalk.bgRed(err));
  } else {
    console.info(Chalk.black.bgGreen(
      `\n\n💂  Listening at http://${appConfig.host}:${appConfig.port}\n`
    ));
  }
});
