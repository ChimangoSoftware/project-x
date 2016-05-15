import sequelize = require('sequelize');

export = function clienteSequalize(sequelizeInstance: sequelize.Sequelize): sequelize.Model<model.Cliente, model.ClienteAttributes> {
    let attributes: sequelize.DefineAttributes = {
        _id: {
            type: sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: sequelize.STRING,
        apellido: sequelize.STRING
    };

    let options: sequelize.DefineOptions<model.Cliente> = {
        instanceMethods: {
            nombreCompleto: () => {
                return this.nombre + ', ' + this.apellido;
            }
        }
    };

    return sequelizeInstance.define('Cliente', attributes, options);
}
