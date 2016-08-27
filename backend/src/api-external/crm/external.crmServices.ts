import sequelizeInstance = require('./../../config/seq-crm-config');

import PersonaDao from './persona/persona.dao';
import {ICRMPersonaService, CRMPersonaService} from './persona/persona.service';
const personaDao = new PersonaDao(sequelizeInstance);
export const crmPersonaService = new CRMPersonaService(personaDao);
