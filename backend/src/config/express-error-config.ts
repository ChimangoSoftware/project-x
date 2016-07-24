import express = require('express');
const config = require('./environment');

module.exports = function (app) {

  // error middleware to prevent leaking
  // error messages in production mode
  app.use((err, req, res, next) => {
    const error = config.env === 'production' ?
      { message: err.message } :
      { err: err, stack: err.stack };
    
    return res.status(err.status).json(error);
  });
};
