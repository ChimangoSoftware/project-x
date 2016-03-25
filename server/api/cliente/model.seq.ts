'use strict';

import Sequelize = require('sequelize');

export = function clienteSequalize(sequelizeInstance): Sequelize.Model<models.Cliente, models.ClienteAttributes> {
    let attributes = {
        _id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: Sequelize.STRING,
        apellido: Sequelize.STRING
    };

    let clienteMethods: models.ClienteMethods = {
        nombreCompleto: () => {
            return this.nombre + ', ' + this.apellido;
        }
    };

    let options = {
        instanceMethods: clienteMethods
    };

    return sequelizeInstance.define('Cliente', attributes, options);
}
