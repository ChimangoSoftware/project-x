import Sequelize = require('sequelize');
import clienteSequalize = require('./model.seq');

class ClienteDao implements service.ClienteService {
    model: Sequelize.Model<models.Cliente, models.ClienteAttributes>;

    constructor(sequelizeInstance) {
        this.model = clienteSequalize(sequelizeInstance);
    }

    list(done: service.SimpleResponse<models.Cliente[]>): void {
        this.model.findAll()
            .then((clientes: models.Cliente[]) => {
                return done(null, clientes);
            }).catch((err) => {
                return done(err);
            });
    };
}

export default ClienteDao;
