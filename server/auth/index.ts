'use strict';

import express = require('express');
// import passport = require('passport');
import sqldb = require('../config/sequelize-config');

let router = express.Router();
//let User = sqldb.User;

// Passport Configuration
//require('./local/passport')(User, config);
require('./local/passport')({});
router.use('/local', require('./local'));

module.exports = router;
