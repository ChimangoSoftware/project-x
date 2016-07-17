import sequelize = require('sequelize');
import config = require('./environment');

let sequelizeInstance = new sequelize(
    config.sequelize.database,
    config.sequelize.username,
    config.sequelize.password,
    config.sequelize.options
);

export = sequelizeInstance;
