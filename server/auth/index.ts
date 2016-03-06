'use strict';

let express = require('express');
let passport = require('passport');
let config = require('./../config/environment');
import sqldb = require('../config/sequelize-config');

//let User = sqldb.User;

// Passport Configuration
//require('./local/passport')(User, config);
require('./local/passport')({}, config);

var router = express.Router();

router.use('/local', require('./local'));

module.exports = router;
