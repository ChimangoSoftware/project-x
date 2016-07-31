import express = require('express');
import servicesInstances = require('./../api/servicesInstances');
import ClienteService = require('./../api/cliente/cliente.service');
import UserService = require('./../api/user/user.service');

module.exports = function config(app: express.Application, seneca: any) {
    seneca.use(ClienteService.getClass().registerMethodsAsSenecaServices(servicesInstances[ClienteService.getClass()]));
    seneca.use(UserService.getClass().registerMethodsAsSenecaServices(servicesInstances[UserService.getClass()]));
    // Start seneca client and server
    seneca.client({ port: 3000, pin: 'role: api' }).listen(3000);
};
