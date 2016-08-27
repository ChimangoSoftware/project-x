module.exports = {
  ownDB: {
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    options: {
      host: process.env.DB_HOST,
      dialect: process.env.DB_SEQUELIZE_DIALECT,
      timestamps: false
    }
  },

  crmDB: {
    database: process.env.CRM_DB_NAME,
    username: process.env.CRM_DB_USERNAME,
    password: process.env.CRM_DB_PASSWORD,
    options: {
      host: process.env.CRM_DB_HOST,
      port: process.env.CRM_DB_PORT,
      dialect: process.env.DB_MYSQL_DIALECT,
      timestamps: false,
      define: {
        freezeTableName: true
      }
    }
  },

  seedDB: false
};
