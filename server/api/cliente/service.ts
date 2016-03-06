import ClienteDao from './dao';

class ClientService implements service.ClienteService {

    constructor(private dao: ClienteDao) {}

    list(done: service.SimpleResponse<models.Cliente[]>): void {
        return this.dao.list(done);
    }
}

export default ClientService;
