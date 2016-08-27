import sequelize = require('sequelize');
import config = require('./environment');

//let sequelizeInstance = new sequelize('Mysql://root@localhost:3306/crediuno');

let sequelizeInstance = new sequelize(
    config.crmDB.database,
    config.crmDB.username,
    config.crmDB.password,
    config.crmDB.options
);

export = sequelizeInstance;
