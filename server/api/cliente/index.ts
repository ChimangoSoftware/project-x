import sqldb = require('./../../config/sequelize-config');
import Dao from './dao';
import ClienteService from './service';

module.exports = function cliente(options) {
    let dao = new Dao(sqldb);
    let clienteService = new ClienteService(dao);

    this.add('role:api, service:cliente, operation:list', (msg, respond) => {
        clienteService.list(respond);
    });
}
