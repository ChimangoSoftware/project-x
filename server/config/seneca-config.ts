import express = require('express');

import sequelizeInstance = require('./sequelize-config');

import ClienteService from '../api/cliente/seneca.service';
import ClienteDao from '../api/cliente/cliente.dao';

module.exports = function config(app: express.Application, seneca: any) {

    seneca.use(ClienteService.getClass().registerMethodsAsSenecaServices(new ClienteDao(sequelizeInstance)));

    // Start seneca client and server
    seneca.client({ port: 3000, pin: 'role: api' }).listen(3000);
    // app.use(seneca.export('web')).listen(3000);
};
