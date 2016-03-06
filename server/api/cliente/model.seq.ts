'use strict';

import Sequelize = require('sequelize');

export = function clienteSequalize(sequelizeInstance): Sequelize.Model<models.Cliente, models.ClienteAtributos> {
    let atributos = {
        _id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: Sequelize.STRING,
        apellido: Sequelize.STRING
    };

    let clienteMetodos: models.ClienteMetodos = {
        nombreCompleto: () => {
            return this.nombre + ', ' + this.apellido;
        }
    };

    let opciones = {
        instanceMethods: clienteMetodos
    };

    return sequelizeInstance.define('Cliente', atributos, opciones);
}
