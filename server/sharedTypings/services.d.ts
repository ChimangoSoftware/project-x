declare namespace service {
    interface SimpleResponse<T> { (error: Error, response?: T): void; }
    interface DeleteResponse { result: boolean; }

    interface ClienteService {
        create(cliente: model.Cliente, done?: service.SimpleResponse<model.Cliente>): Promise<model.Cliente>;
        list(done?: service.SimpleResponse<model.Cliente[]>): Promise<model.Cliente[]>;
        getById(id: number, done?: service.SimpleResponse<model.Cliente>): Promise<model.Cliente>;
        update(cliente: model.Cliente, done?: service.SimpleResponse<model.Cliente>): Promise<model.Cliente>;
        delete(id: number, done?: service.SimpleResponse<service.DeleteResponse>): Promise<service.DeleteResponse>;
    }

    interface UserService {
        find(filter: any, done: service.SimpleResponse<model.User>);
    }
}

