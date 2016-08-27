import sequelize = require('sequelize');
import config = require('./environment');

let sequelizeInstance = new sequelize(
    config.ownDB.database,
    config.ownDB.username,
    config.ownDB.password,
    config.ownDB.options
);

export = sequelizeInstance;
