import ClienteDao from './cliente.dao';
import SenecaService = require('../../seneca.service');

@SenecaService({ role: 'api', service: 'clienteService' })
export default class ClienteService implements service.ClienteService {

    static getClass(): any {
        return ClienteService;
    }

    constructor(private dao: ClienteDao) { }

    create(cliente: model.Cliente, done: service.SimpleResponse<model.Cliente>): Promise<model.Cliente> {
        let promise = this.dao.create(cliente);
        promise.then((dbCliente) => done(null, dbCliente));
        promise.catch((err) => done(null));
        return promise;
    }

    list(done: service.SimpleResponse<model.Cliente[]>): Promise<model.Cliente[]> {
        let promise = this.dao.list();
        promise.then((dbClientes) => done(null, dbClientes));
        promise.catch((err) => done(null));
        return promise;
    }

    getById(id: number, done: service.SimpleResponse<model.Cliente>): Promise<model.Cliente> {
        let promise = this.dao.getById(id);
        promise.then((dbCliente) => done(null, dbCliente));
        promise.catch((err) => done(null));
        return promise;
    }

    update(cliente: model.Cliente, done: service.SimpleResponse<model.Cliente>): Promise<model.Cliente> {
        let promise = this.dao.update(cliente);
        promise.then((dbCliente) => done(null, dbCliente));
        promise.catch((err) => done(null));
        return promise;
    }

    delete(id: number, done: service.SimpleResponse<service.DeleteResponse>) {
        let promise = this.dao.delete(id);
        promise.then((dbCliente) => done(null, dbCliente));
        promise.catch((err) => done(null));
        return promise;
    }

}

