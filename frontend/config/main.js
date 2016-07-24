/** General Configurations Like PORT, HOST names and etc... */
require('dotenv').config();

var config = {
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 8889,
  karmaPort: 9876,

  auth0: {
    clientId: process.env.AUTH0_CLIENT_ID,
    domain: process.env.AUTH0_DOMAIN,
    secret: process.env.AUTH0_SECRET
  },

  api: {
    host: process.env.API_HOST || 'http://localhost',
    port: process.env.API_PORT || 9000,
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  },

  // This part goes to React-Helmet for Head of our HTML
  app: {
    head: {
      title: 'barbar-vortigern',
      titleTemplate: 'barbar-vortigern: %s',
      meta: [
        { charset: 'utf-8' },
        { 'http-equiv': 'x-ua-compatible', content: 'ie=edge' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'React Redux Typescript' },
      ]
    }
  }
};

module.exports = config;
