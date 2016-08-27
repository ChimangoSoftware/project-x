import sequelize = require('sequelize');

export interface ICRMPersona {
  Id: number;
  Documento: number;
  Legajo: number;
  Nombre: string;
  FechaNacimiento: string;
  Cuil1: number;
  Cuil2: number;
  IngresoMensual: number;
  NombrePadre: string;
  NombreMadre: string;
  DocumentoConyuge: number;
  NombreConyuge: string;
  CantidadHijos: number;
  VencimientoAlquiler: string;
  PresentaEscritura: boolean;
  observacion: string;
  TipoOcupacion: string;
  Seccion: string;
  LegajoLaboral: string;
  ReciboIngresos: string;
  EstadoCivilAnterior: string;
  fechaIngreso: string;
  fechaBaja: string;
  fechaAlta: string;
  Anotacion: string;
  Email: string;
  RamoAnterior: string;

  IdTipoDocumento: number;
  IdNacionalidad: number;
  IdEstadoCivil: number;
  IdRamo: number;
  IdDomicilio: number;
  IdEmpresa: number;
  IdEstado: number;
  IdTipoPersona: number;
  IdSucursal: number;
  idSexo: number;
}
export interface ICRMPersonaInstance extends sequelize.Instance<ICRMPersona>, ICRMPersona { }

export function crmPersonaSequalize(sequelizeInstance: sequelize.Sequelize): sequelize.Model<ICRMPersonaInstance, ICRMPersona> {
  const attributes: sequelize.DefineAttributes = {
    id: {
      type: sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },

    Documento: sequelize.INTEGER,
    Legajo: sequelize.INTEGER,
    IngresoMensual: sequelize.INTEGER,
    DocumentoConyuge: sequelize.INTEGER,
    Cuil1: sequelize.INTEGER,
    Cuil2: sequelize.INTEGER,
    CantidadHijos: sequelize.INTEGER,

    PresentaEscritura: sequelize.BOOLEAN,

    FechaNacimiento: sequelize.DATE,
    VencimientoAlquiler: sequelize.DATE,
    ReciboIngresos: sequelize.DATE,
    fechaIngreso: sequelize.DATE,
    fechaBaja: sequelize.DATE,
    fechaAlta: sequelize.DATE,

    NombreConyuge: sequelize.STRING,
    Nombre: sequelize.STRING,
    NombrePadre: sequelize.STRING,
    NombreMadre: sequelize.STRING,
    observacion: sequelize.STRING,
    TipoOcupacion: sequelize.STRING,
    Seccion: sequelize.STRING,
    LegajoLaboral: sequelize.STRING,
    EstadoCivilAnterior: sequelize.STRING,
    Anotacion: sequelize.STRING,
    Email: sequelize.STRING,
    RamoAnterior: sequelize.STRING,

    IdTipoDocumento: sequelize.INTEGER,
    IdNacionalidad: sequelize.INTEGER,
    IdEstadoCivil: sequelize.INTEGER,
    IdRamo: sequelize.INTEGER,
    IdDomicilio: sequelize.INTEGER,
    IdEmpresa: sequelize.INTEGER,
    IdEstado: sequelize.INTEGER,
    IdTipoPersona: sequelize.INTEGER,
    IdSucursal: sequelize.INTEGER,
    idSexo: sequelize.INTEGER
  };

  const options: sequelize.DefineOptions<ICRMPersona> = {
    timestamps: false
  };

  return sequelizeInstance.define<ICRMPersonaInstance, ICRMPersona>('persona', attributes, options);
}
