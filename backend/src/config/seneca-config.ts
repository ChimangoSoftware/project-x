import express = require('express');
import {
  clienteService,
  morosidadService,
  userService
} from './../api/servicesInstances';

import ClienteService = require('./../api/cliente/cliente.service');
import UserService = require('./../api/user/user.service');
import MorosidadService = require('./../api/morosidad/morosidad.service');

module.exports = function config(app: express.Application, seneca: any) {
  seneca.use(ClienteService.getClass().registerMethodsAsSenecaServices(clienteService));
  seneca.use(UserService.getClass().registerMethodsAsSenecaServices(userService));
  seneca.use(MorosidadService.getClass().registerMethodsAsSenecaServices(morosidadService));

  // Start seneca client and server
  seneca.client({ port: 3000, pin: 'role: api' }).listen(3000);
};
