import Promise = require('bluebird');
import senecaService = require('../../routes/seneca.service');
import permission = require('../../routes/permission');

import {crmPersonaService} from './../../api-external/crm/external.crmServices';
import {ICRMPersona} from './../../api-external/crm/persona/persona.model.seq';

const serviceName = 'morosidadService';

@senecaService({ role: 'api', service: serviceName })
class MorosidadService implements service.MorosidadService {

  static getClass(): any {
    return MorosidadService;
  }

  constructor() { }

  getByNroDocumento(nroDocumento: number): Promise<model.Persona> {
    return new Promise<model.Persona>((resolve, reject) => {
      crmPersonaService.getByNroDocumento(nroDocumento)
        .then((crmPersona) => {
          resolve({
            nombre: crmPersona.Nombre,
            apellido: crmPersona.Nombre,
            tipoDocumento: crmPersona.IdTipoDocumento,
            numeroDocumento: crmPersona.Documento,
            sexo: crmPersona.idSexo
          });
        })
        .catch(error => resolve(error));
    });
  }
}

export = MorosidadService;
