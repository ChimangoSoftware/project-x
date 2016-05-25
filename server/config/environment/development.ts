module.exports = {
  sequelize: {
    database: 'chimango',
    username: 'postgres',
    passowrd: '1234',
    options: {
      host: 'localhost',
      dialect: 'postgres',
      timestamps: false
    }
  },

  seedDB: false
};
