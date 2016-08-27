import sequelizeInstance = require('../config/seq-own-config');

import ClienteService = require('./cliente/cliente.service');
import ClienteDao = require('./cliente/cliente.dao');
const clienteDao = new ClienteDao(sequelizeInstance);
export const clienteService = new ClienteService(clienteDao);

import MorosidadService = require('./morosidad/morosidad.service');
export const morosidadService = new MorosidadService();

import UserService = require('./user/user.service');
import UserDao = require('./user/user.dao');
const userDao = new UserDao(sequelizeInstance);
export const userService = new UserService(userDao);
