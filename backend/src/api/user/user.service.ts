import Promise = require('bluebird');
import UserDao = require('./user.dao');
import senecaService = require('../../routes/seneca.service');
import permission = require('../../routes/permission');

const userService = 'userService';

@senecaService({ role: 'api', service: userService })
class UserService implements service.UserService {

  static getClass(): any {
    return UserService;
  }

  constructor(private dao: UserDao) { }

  create(user: model.User): Promise<model.User> {
    return this.dao.create(user);
  }

  getRolesByExternalId(id: string): Promise<string[]> {
    return this.dao.getRolesByExternalId(id);
  }

  setRolesByExternalId(data: { id: string; roles: string[] }): Promise<string[]> {
    return this.dao.setRolesByExternalId(data);
  }
}

export = UserService;