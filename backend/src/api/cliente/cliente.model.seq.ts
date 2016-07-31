import sequelize = require('sequelize');

export interface ClienteInstance extends sequelize.Instance<model.Cliente>, model.Cliente { }

export interface ClienteModel extends sequelize.Model<ClienteInstance, model.Cliente> { }

export function clienteSequalize(sequelizeInstance: sequelize.Sequelize): sequelize.Model<ClienteInstance, model.Cliente> {
    const attributes: sequelize.DefineAttributes = {
        _id: {
            type: sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: sequelize.STRING,
        apellido: sequelize.STRING,
        tipoDocumento: sequelize.INTEGER,
        numeroDocumento: sequelize.INTEGER,
        sexo: sequelize.ENUM('F', 'M'),
        fechaNacimiento: sequelize.DATE,
        cuit: sequelize.STRING,
        cuil: sequelize.STRING,
        nacionalidad: sequelize.STRING,
        estadoCivil: sequelize.ENUM('soltero', 'casado', 'divorciado', 'concubino', 'separado'),
        conyuge: sequelize.JSON,
        provincia: sequelize.STRING,
        CPA: sequelize.INTEGER,
        direcciones: sequelize.ARRAY(sequelize.JSON),
        telefonos: sequelize.ARRAY(sequelize.JSON),
        relacionDependencia: sequelize.ARRAY(sequelize.JSON),
        actividadComercial: sequelize.JSON
    };

    const options: sequelize.DefineOptions<model.Cliente> = {
        instanceMethods: {
            nombreCompleto: () => {
                return this.nombre + ', ' + this.apellido;
            }
        }
    };

    return sequelizeInstance.define<ClienteInstance, model.Cliente>('Cliente', attributes, options);
}
