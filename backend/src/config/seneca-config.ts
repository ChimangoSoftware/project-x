import express = require('express');

import ClienteService from './../api/cliente/cliente.service';
import ClienteDao from '../api/cliente/cliente.dao';

module.exports = function config(app: express.Application, seneca: any) {

    seneca.use(ClienteService.getClass().registerMethodsAsSenecaServices(new ClienteDao()));

    // Start seneca client and server
    seneca.client({ port: 3000, pin: 'role: api' }).listen(3000);
};
