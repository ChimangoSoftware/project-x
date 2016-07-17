import path = require('path');
import express = require('express');
import _ = require('lodash');
import passport = require('passport');
import {signToken} from './auth/auth.service';


module.exports = function (app: express.Application, seneca: any) {

    app.get('/login',
        passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
        function (req: express.Request, res: express.Response) {
            if (!req.user) {
                throw new Error('user null');
            }
            res.redirect("/user");
        }
    );

    app.get('/user', function (req, res) {
        res.json(req.user);
    });

    // request to seneca
    app.post('/api/service', (req: express.Request, res: express.Response, next: express.NextFunction) => {
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

    // All other routes should redirect to the index.html
    app.get('/*', (req, res) => {
        res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
