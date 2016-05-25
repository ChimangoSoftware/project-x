import sequelize = require('sequelize');
import Promise = require('bluebird');
import {clienteSequalize, ClienteModel, ClienteInstance} from './cliente.model.seq';
import sequelizeInstance = require('../../config/sequelize-config');

export default class ClienteDao implements service.ClienteService {

    public model: sequelize.Model<ClienteInstance, model.Cliente>;

    constructor() {
        this.model = clienteSequalize(sequelizeInstance);
    }

    create(cliente: model.Cliente): Promise<model.Cliente> {
        let resolver = Promise.defer<model.Cliente>();
        this.model.create(cliente)
            .then((dbCliente) => resolver.resolve(dbCliente.toJSON()))
            .catch((err) => resolver.reject(err));
        return resolver.promise;
    }

    list(): Promise<model.Cliente[]> {
        let resolver = Promise.defer<model.Cliente[]>();
        this.model.findAll()
            .then((clientes: model.Cliente[]) => resolver.resolve(clientes))
            .catch((err) => resolver.reject(err));
        return resolver.promise;
    };

    getById(id: number): Promise<model.Cliente> {
        let resolver = Promise.defer<model.Cliente>();
        this.model.findById(id)
            .then((cliente) => resolver.resolve(cliente.toJSON()))
            .catch((err) => resolver.reject(err));
        return resolver.promise;
    };

    update(cliente: model.Cliente): Promise<model.Cliente> {
        let resolver = Promise.defer<model.Cliente>();
        this.model.findById(cliente._id)
            .then((dbCliente) => {
                dbCliente.update(cliente)
                    .then((updatedCliente) => resolver.resolve(updatedCliente.toJSON()))
                    .catch((err) => resolver.reject(err));
            })
            .catch((err) => resolver.reject(err));
        return resolver.promise;
    }

    delete(id: number): Promise<service.DeleteResponse> {
        let resolver = Promise.defer<service.DeleteResponse>();
        this.model.findById(id)
            .then((dbCliente) => {
                dbCliente.destroy(dbCliente)
                    .then((updatedCliente) => resolver.resolve({ result: true }))
                    .catch((err) => resolver.reject(err));
            })
            .catch((err) => resolver.reject(err));
        return resolver.promise;
    }
}
