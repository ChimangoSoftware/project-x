import Sequelize = require('sequelize');
import config = require('./environment');

// Create connection
let sequelizeInstance = new Sequelize  (
    config.sequelize.database,
    config.sequelize.username,
    config.sequelize.password,
    config.sequelize.options
);

export = sequelizeInstance;
