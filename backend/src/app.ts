'use strict';

import express = require('express');
var http = require('http');

// config
import config = require('./config/environment');

// sequelize
import sequelizeInstance = require('./config/sequelize-config');

// Populate databases with sample data
//if (config.seedDB) { require('./config/seed'); }

// server
let app = express();

require('./config/express-config')(app);

// socketio
/*
var socketio = require('socket.io-config')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);
*/

// seneca
let seneca = require('seneca');
seneca = seneca({
  log: {
    map: [
      { level: 'ERROR',  handler: 'print' }
    ]
  }
});

require('./config/seneca-config')(app, seneca);

// routes
require('./routes')(app, seneca);

// Error handlers
require('./config/express-error-config')(app);

let server = http.createServer(app);

// Start server - express
function startServer() {
    server.listen(config.port, config.ip, function() {
        console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
    });
}

// start sequelize
sequelizeInstance.sync()
    .then(startServer)
    .catch(function(err) {
        console.log('Server failed to start due to error: %s', err);
    });

// Expose app
exports = module.exports = app;
