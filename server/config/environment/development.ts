'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // Sequelize connecton opions
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

  // Seed database on startup

  seedDB: false

};
