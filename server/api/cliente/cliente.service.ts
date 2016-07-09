import ClienteDao from './cliente.dao';
import SenecaService = require('../../seneca.service');

@SenecaService({ role: 'api', service: 'clienteService' })
export default class ClienteService implements service.ClienteService {

    static getClass(): any {
        return ClienteService;
    }

    constructor(private dao: ClienteDao) { }

    create(cliente: model.Cliente, done: service.SimpleResponse<model.Cliente>): void {
        this.dao.create(cliente)
            .then((dbCliente) => done(null, dbCliente))
            .catch((err) => done(err));
    }

    list(done: service.SimpleResponse<model.Cliente[]>): Promise<model.Cliente[]> {
        let promise = this.dao.list();
        promise.then((dbClientes) => done(null, dbClientes));
        promise.catch((err) => done(null));
        return promise;
    }

    getById(id: number, done: service.SimpleResponse<model.Cliente>): void {
        this.dao.getById(id)
            .then((dbCliente) => done(null, dbCliente))
            .catch((err) => done(null));
    }

    update(cliente: model.Cliente, done: service.SimpleResponse<model.Cliente>): void {
        this.dao.update(cliente)
            .then((dbCliente) => done(null, dbCliente))
            .catch((err) => done(null));
    }

    delete(id: number, done: service.SimpleResponse<service.DeleteResponse>): void {
        this.dao.delete(id)
            .then((dbCliente) => done(null, dbCliente))
            .catch((err) => done(null))
    }

}

