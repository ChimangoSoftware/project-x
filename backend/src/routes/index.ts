import express = require('express');
import _ = require('lodash');

import permission = require('./permission')
import {userService} from './../api/servicesInstances';
import UserService = require('./../api/user/user.service');

const jwt = require('express-jwt');
const config = require('../config/environment');

module.exports = function (app: express.Application, seneca: any) {

  const checkRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.body.service || !req.body.operation) {
      res.send(500, 'Invalid request!');
    }
    next();
  }

  const checkAuthentication = jwt({ secret: new Buffer(config.tokenSecret, 'base64') });

  const senecaQuery = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    var query = _.extend({ 'role': 'api' }, req.body);
    seneca.act(query, function (err, value) {
      if (err) {
        const status = err.status ? err.status : 400;
        res.status(status).json(err);
      } else {
        res.json(value);
      }
    });
  };

  const checkPermission = function (req: express.Request, res: express.Response, next: express.NextFunction) {
    userService.getRolesByExternalId(req.user.sub)
      .then((roles: string[]) => {
        const result = permission.getEndpointPermission(req.body.service, req.body.operation, roles);
        if (!result) res.send(403);
        next();
      })
      .catch(() => res.send(500, 'Error trying to check request permissions.'));
  };

  app.post('/api/service', checkRequest, checkAuthentication, checkPermission, senecaQuery);
};
