declare namespace service {
    interface SimpleResponse<T> { (error: Error, response?: T): void; }

    interface ClienteService {
        list(done: service.SimpleResponse<models.Cliente[]>): void;
    }
}

declare namespace models {
    interface User {
        name: string;
        password: string;
    }

    interface ClienteMethods {
        nombreCompleto: () => string;
    }
    interface ClienteAttributes {
        _id?: number;
        nombre: string;
        apellido: string;
    }
    interface Cliente extends ClienteMethods, ClienteAttributes {}
}