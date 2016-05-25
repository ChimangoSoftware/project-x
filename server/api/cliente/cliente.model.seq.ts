import sequelize = require('sequelize');

export interface ClienteInstance extends sequelize.Instance<model.Cliente>, model.Cliente { }

export interface ClienteModel extends sequelize.Model<ClienteInstance, model.Cliente> { }

export function clienteSequalize(sequelizeInstance: sequelize.Sequelize): sequelize.Model<ClienteInstance, model.Cliente> {
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

    return sequelizeInstance.define<ClienteInstance, model.Cliente>('Cliente', attributes, options);
}
