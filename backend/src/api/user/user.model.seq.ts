import sequelize = require('sequelize');
export interface UserInstance extends sequelize.Instance<model.User>, model.User { }

export interface UserModel extends sequelize.Model<UserInstance, model.User> { }

export function userSequalize(sequelizeInstance: sequelize.Sequelize): sequelize.Model<UserInstance, model.User> {

  const attributes: sequelize.DefineAttributes = {
    _id: {
      type: sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    externalId: {
      type: sequelize.STRING,
      allowNull: true
    },
    roles: {
      type: sequelize.ARRAY(sequelize.STRING)
    }
  };

  const options: sequelize.DefineOptions<UserInstance> = {
    indexes: [
      {
        unique: true,
        fields: ['externalId']
      }
    ]
  };

  return sequelizeInstance.define<UserInstance, model.User>('User', attributes, options);
};
