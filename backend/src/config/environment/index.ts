'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
    if (!name) {
        throw new Error('You must set the NODE_ENV environment variable');
    }
    return name;
}

// All configurations will extend these options
// ============================================
var all = {
    env: process.env.NODE_ENV,

    // Root path of server
    root: path.normalize(__dirname + '/../../..'),

    // Server port
    port: process.env.PORT || 9000,

    // Server IP
    ip: process.env.IP || '0.0.0.0',

    // Should we populate the DB with sample data?
    seedDB: false,

    // jwt auth token secret
    tokenSecret: process.env.TOKEN_SECRET,

    // Secret for session, you will want to change this and make it an environment variable
    secrets: {
        session: 'chimango-secret'
    }
};

// Export the config object based on the NODE_ENV
// ==============================================
export = _.merge(
    all,
    require('./shared'),
    require('./' + requiredProcessEnv(process.env.NODE_ENV) + '.js') || {}
);
