import sequelize = require('sequelize');
import userSequelizeModel = require('./user.model.seq');
import sequelizeInstance = require('../../config/sequelize-config');

export default class UserDao implements service.UserService {

    model: sequelize.Model<model.User, model.UserAttributes>;

    constructor() {
        this.model = userSequelizeModel(sequelizeInstance);
    }

    find(filter: any, done: service.SimpleResponse<model.User>): void {
        this.model.find(filter)
            .then((user: model.User) => {
                return done(null, user);
            }).catch((err) => {
                return done(err);
            });
    };
}
