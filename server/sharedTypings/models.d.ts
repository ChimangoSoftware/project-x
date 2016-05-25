/// <reference path="../../typings/sequelize/sequelize.d.ts" />

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

    interface Cliente {
        _id?: number;
        nombre: string;
        apellido: string;
    }
}