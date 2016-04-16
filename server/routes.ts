'use strict';

import path = require('path');
import express = require('express');
import _ = require('lodash');

let errors = require('./components/errors');

module.exports = function(app, seneca) {

    app.post('/api/service', (req: express.Request, res: express.Response) => {
        var query = _.extend({ 'role': 'api' }, req.body);
        seneca.act(query, function(err, value) {
            if (err) {
                var status = err.status ? err.status : 400;
                res.status(status).json(err);
            } else {
                res.json(value);
            }
        });
    });

    // app.use('/auth', require('./auth'));

    // All other routes should redirect to the index.html
    app.get('/*', (req, res) => {
        res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
