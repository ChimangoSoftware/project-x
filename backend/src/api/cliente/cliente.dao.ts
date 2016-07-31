import sequelize = require('sequelize');
import Promise = require('bluebird');
import {clienteSequalize, ClienteInstance} from './cliente.model.seq';

class ClienteDao implements service.ClienteService {

    public model: sequelize.Model<ClienteInstance, model.Cliente>;

    constructor(sequelizeInstance: sequelize.Sequelize) {
        this.model = clienteSequalize(sequelizeInstance);
    }

    create(cliente: model.Cliente): Promise<model.Cliente> {
        return new Promise<model.Cliente>((resolve, reject) => {
            this.model.create(cliente)
                .then((dbCliente) => resolve(dbCliente.toJSON()))
                .catch((error) => reject(error));
        });
    }

    list(): Promise<model.Cliente[]> {
        return new Promise<model.Cliente[]>((resolve, reject) => {
            this.model.findAll()
                .then((clientes: model.Cliente[]) => resolve(clientes))
                .catch((err) => reject(err));
        });
    };

    getById(id: number): Promise<model.Cliente> {
        return new Promise<model.Cliente>((resolve, reject) => {
            this.model.findById(id)
                .then((cliente) => resolve(cliente.toJSON()))
                .catch((err) => reject(err));

        })
    };

    update(cliente: model.Cliente): Promise<model.Cliente> {
        return new Promise<model.Cliente>((resolve, reject) => {
            this.model.update(cliente, { where: { _id: cliente._id }, returning: true })
                .then((response) => resolve(response[1][0].toJSON()))
                .catch((err) => reject(err));
        })
    }

    delete(id: number): Promise<service.DeleteResponse> {
        return new Promise<service.DeleteResponse>((resolve, reject) => {
            this.model.destroy({ where: { _id: id } })
                .then((updatedCliente) => resolve({ result: true }))
                .catch((err) => reject(err));

        });
    }
}

export = ClienteDao;