import sequelize = require('sequelize');
import Promise = require('bluebird');
import {crmPersonaSequalize, ICRMPersonaInstance, ICRMPersona} from './persona.model.seq';
import {ICRMPersonaService} from './persona.service.ts';

export default class PersonaDao implements ICRMPersonaService {

    public seqModel: sequelize.Model<ICRMPersonaInstance, ICRMPersona>;

    constructor(sequelizeInstance: sequelize.Sequelize) {
        this.seqModel = crmPersonaSequalize(sequelizeInstance);
    }

    getById(id: number): Promise<ICRMPersona> {
        return new Promise<ICRMPersona>((resolve, reject) => {
            this.seqModel.findById(id)
                .then((persona) => resolve(persona.toJSON()))
                .catch((err) => reject(err));

        })
    };

    getByNroDocumento(nroDocumento: number): Promise<ICRMPersona> {
        return new Promise<ICRMPersona>((resolve, reject) => {
            this.seqModel.findOne({where: {Documento: nroDocumento}})
                .then((persona) => resolve(persona.toJSON()))
                .catch((err) => reject(err));

        })
    };
}

