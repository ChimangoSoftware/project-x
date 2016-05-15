declare namespace model {

    interface UserAttributes {
        _id?: number;
        name: string;
        email: string;
        role: any;
        password: string;
        provider: string;
        salt: string;
    }
    interface User extends model.UserAttributes {
        authenticate(password: string, callback: Function): void;
    }

    interface ClienteAttributes {
        _id?: number;
        nombre: string;
        apellido: string;
    }
    interface Cliente extends model.ClienteAttributes {
        nombreCompleto(): string;
    }
}