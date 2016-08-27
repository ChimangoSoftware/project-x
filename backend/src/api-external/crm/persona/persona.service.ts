import PersonaDao from './persona.dao';
import {ICRMPersona} from './persona.model.seq';

export interface ICRMPersonaService {
  getById(id: number): Promise<ICRMPersona>;
  getByNroDocumento(nroDocumetno: number): Promise<ICRMPersona>;
}

export class CRMPersonaService implements ICRMPersonaService {

    constructor(private dao: PersonaDao) { }

    getById(id: number): Promise<ICRMPersona> {
        return this.dao.getById(id);
    }

    getByNroDocumento(nroDocumento: number): Promise<ICRMPersona> {
      return this.dao.getByNroDocumento(nroDocumento);
    }
}
