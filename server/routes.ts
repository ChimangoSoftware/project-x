import path = require('path');
import express = require('express');
import _ = require('lodash');
import passport = require('passport');
import {signToken} from './auth/auth.service';


module.exports = function (app: express.Application, seneca: any) {

    // local authentication
    app.post('/auth/local', function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            let error = err || info;
            if (error || !user) {
                return res.status(401).json(error);
            }

            let token = signToken(user._id, user.role);
            res.json({ token });
        })(req, res, next);
    });

    // request to seneca
    app.post('/api/service', (req: express.Request, res: express.Response, next: express.NextFunction) => {
        var query = _.extend({ 'role': 'api' }, req.body);
        seneca.act(query, function (err, value) {
            if (err) {
                var status = err.status ? err.status : 400;
                res.status(status).json(err);
            } else {
                res.json(value);
            }
        });
    });

    // All other routes should redirect to the index.html
    app.get('/*', (req, res) => {
        res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
