declare namespace service {
    interface SimpleResponse<T> { (error: Error, response?: T): void; }

    interface ClienteService {
        list(done: service.SimpleResponse<model.Cliente[]>): void;
    }

    interface UserService {
        find(filter: any, done: service.SimpleResponse<model.User>): void;
    }
}

