declare namespace utils {
    interface Direccion {
        provincia: number;
        localidad: number;
        calle: string;
        numero: string;
        departamento: string;
        piso: string;
    }

    interface Telefono {
        area: number;
        numero: number;
    }

    interface Entidad {
        nombre: string,
        telefonos?: utils.Telefono[];
        direccion?: utils.Direccion[];
    }


}