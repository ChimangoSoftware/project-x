import sequelizeInstance = require('../config/sequelize-config');

import ClienteService = require('./cliente/cliente.service');
import ClienteDao = require('./cliente/cliente.dao');

import UserService = require('./user/user.service');
import UserDao = require('./user/user.dao');

let servicesInstances = {};
servicesInstances[ClienteService.getClass()] = new ClienteDao(sequelizeInstance);
servicesInstances[UserService.getClass()] = new UserDao(sequelizeInstance);

module.exports = servicesInstances;
