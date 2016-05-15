import sequelize = require('sequelize');
import clienteSequalizeModel = require('./cliente.model.seq');

export default class ClienteDao implements service.ClienteService {

    model: sequelize.Model<model.Cliente, model.ClienteAttributes>;

    constructor(sequelizeInstance: sequelize.Sequelize) {
        this.model = clienteSequalizeModel(sequelizeInstance);
    }

    list(done: service.SimpleResponse<model.Cliente[]>): void {
        this.model.findAll()
            .then((clientes: model.Cliente[]) => {
                return done(null, clientes);
            }).catch((err) => {
                return done(err);
            });
    };
}
