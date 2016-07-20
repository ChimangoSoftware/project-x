/// <reference path="./../../typings/index.d.ts" />

// HTTP request logger middleware for node.js - https://github.com/expressjs/morgan
const morgan = require('morgan');
// attempt to compress response bodies for all request - https://github.com/expressjs/compression
const compression = require('compression');
const bodyParser = require('body-parser');

module.exports = function (app) {
    app.use(compression());
    app.use(bodyParser.json());
};
