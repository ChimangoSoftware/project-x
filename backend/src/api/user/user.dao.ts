import sequelize = require('sequelize');
import Promise = require('bluebird');
import {userSequalize, UserInstance} from './user.model.seq';

class UserDao implements service.UserService {

  public seqModel: sequelize.Model<UserInstance, model.User>;

  constructor(sequelizeInstance: sequelize.Sequelize) {
    this.seqModel = userSequalize(sequelizeInstance);
  }

  create(user: model.User): Promise<model.User> {
    return new Promise<model.User>((resolve, reject) => {
      this.seqModel.create(user)
        .then((dbUser) => resolve(dbUser.toJSON()))
        .catch((error) => reject(error));
    });
  }

  getRolesByExternalId(id: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.seqModel.findOne({ where: { externalId: id } })
        .then((dbUser) => {
          if (dbUser) {
            resolve(dbUser.toJSON().roles)
          } else {
            resolve([])
          }
        })
        .catch((error) => reject(error));
    });
  };

  setRolesByExternalId(data: { id: string; roles: string[] }): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.seqModel.update({ roles: data.roles }, { where: { externalId: data.id } })
        .then(dbUser => resolve(data.roles))
        .catch(err => reject(err));
    });
  };

}

export = UserDao;
