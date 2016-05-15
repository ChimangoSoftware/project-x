import ClienteDao from './cliente.dao';
import SenecaService = require('../../seneca.service');

@SenecaService({ role: 'api', service: 'clienteService' })
export default class ClientService implements service.ClienteService {

    static getClass(): any {
        return ClientService;
    }

    constructor(private dao: ClienteDao) { }

    public list(done: service.SimpleResponse<model.Cliente[]>): void {
        return this.dao.list(done);
    }
}

