import Promise = require('bluebird');
import ClienteDao = require('./cliente.dao');
import senecaService = require('../../routes/seneca.service');
import permission = require('../../routes/permission');

const serviceName = 'clienteService';

@senecaService({ role: 'api', service: serviceName })
class ClienteService implements service.ClienteService {

    static getClass(): any {
        return ClienteService;
    }

    constructor(private dao: ClienteDao) { }

    create(cliente: model.Cliente): Promise<model.Cliente> {
        return this.dao.create(cliente);
    }

    @permission.setEndpointPermission({ service: serviceName, roles: ['role1'] })
    list(): Promise<model.Cliente[]> {
        return this.dao.list();
    }

    getById(id: number): Promise<model.Cliente> {
        return this.dao.getById(id);
    }

    update(cliente: model.Cliente): Promise<model.Cliente> {
        return this.dao.update(cliente);
    }

    delete(id: number): Promise<service.DeleteResponse> {
        return this.dao.delete(id);
    }

}

export = ClienteService;
