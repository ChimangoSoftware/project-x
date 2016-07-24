import express = require('express');
import _ = require('lodash');
const jwt = require('express-jwt');
const config = require('./config/environment');

module.exports = function (app: express.Application, seneca: any) {

  // request to seneca
  app.post('/api/service',
    jwt({ secret: new Buffer(config.tokenSecret, 'base64') }),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {

      var query = _.extend({ 'role': 'api' }, req.body);
      seneca.act(query, function (err, value) {
        if (err) {
          const status = err.status ? err.status : 400;
          res.status(status).json(err);
        } else {
          res.json(value);
        }
      });
    });

};
