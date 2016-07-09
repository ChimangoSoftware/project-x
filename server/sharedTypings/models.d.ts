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

    interface Persona {
        nombre: string;
        apellido: string;
        tipoDocumento: enums.tipoDocumento;
        numeroDocumento: number;
        sexo: enums.sexo;
    }

    interface Cliente extends Persona {
        _id?: number;
        fechaNacimiento?: string;
        cuit?: string;
        cuil?: string;
        nacionalidad?: string;
        estadoCivil?: enums.estadoCivil;
        conyuge?: model.Persona;
        provincia?: number;
        CPA?: number;
        direcciones?: {
            prioridad: number;
            referencia: enums.referencia;
            direccion: utils.Direccion[];
        }[];
        telefonos?: {
            prioridad: number;
            referencia: enums.referencia;
            telefono: utils.Telefono[];
        }[];
        relacionDependencia?: {
            fechaIngreso: string;
            razonSocial: string;
            tipoContratacion: enums.tipoContratacion;
            tipoIngreso: enums.tipoIngreso;
            montoNeto: number;
            montoBruto: number;
            cargo: string;
            datos: utils.Entidad;
        }[];
        actividadComercial?: {
            categoria: enums.categoriaActividadComercial;
            fechaIngreso: string;
            monto: number;
        }
    }
}