import sequelize = require('sequelize');
var crypto2 = require('crypto');


export = function (sequelizeInstance: sequelize.Sequelize): sequelize.Model<model.User, model.UserAttributes> {
  let attributes: sequelize.DefineAttributes = {
    _id: {
      type: sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: sequelize.STRING,
    email: {
      type: sequelize.STRING,
      unique: {
        name: 'email',
        msg: 'The specified email address is already in use.'
      },
      validate: {
        isEmail: true
      }
    },
    role: {
      type: sequelize.STRING,
      defaultValue: 'user'
    },
    password: {
      type: sequelize.STRING,
      validate: {
        notEmpty: true
      }
    },
    provider: sequelize.STRING,
    salt: sequelize.STRING
  };

  let options: sequelize.DefineOptions<model.User> = {

    getterMethods: {
      // Public profile information
      profile: function () {
        return {
          'name': this.name,
          'role': this.role
        };
      },

      // Non-sensitive info we'll be putting in the token
      token: function () {
        return {
          '_id': this._id
        };
      }
    },

    hooks: {
      beforeBulkCreate: function (users, fields, fn) {
        var totalUpdated = 0;
        users.forEach(function (user: any) {
          user.updatePassword(function (err) {
            if (err) {
              return fn(err);
            }
            totalUpdated += 1;
            if (totalUpdated === users.length) {
              return fn();
            }
          });
        });
      },
      beforeCreate: function (user: any, fields, fn) {
        user.updatePassword(fn);
      },
      beforeUpdate: function (user: any, fields, fn) {
        if (user.changed('password')) {
          return user.updatePassword(fn);
        }
        fn();
      }
    },

    instanceMethods: {
      /**
       * Authenticate - check if the passwords are the same
       *
       * @param {String} password
       * @param {Function} callback
       * @return {Boolean}
       * @api public
       */
      authenticate: function (password: string, callback: Function): any {
        if (!callback) {
          return this.password === this.encryptPassword(password);
        }

        var _this = this;
        this.encryptPassword(password, function (err, pwdGen) {
          if (err) {
            callback(err);
          }

          if (_this.password === pwdGen) {
            callback(null, true);
          } else {
            callback(null, false);
          }
        });
      },

      /**
       * Make salt
       *
       * @param {Number} byteSize Optional salt byte size, default to 16
       * @param {Function} callback
       * @return {String}
       * @api public
       */
      makeSalt: function (byteSize, callback) {
        var defaultByteSize = 16;

        if (typeof arguments[0] === 'function') {
          callback = arguments[0];
          byteSize = defaultByteSize;
        } else if (typeof arguments[1] === 'function') {
          callback = arguments[1];
        }

        if (!byteSize) {
          byteSize = defaultByteSize;
        }

        if (!callback) {
          return crypto2.randomBytes(byteSize).toString('base64');
        }

        return crypto2.randomBytes(byteSize, function (err, salt) {
          if (err) {
            callback(err);
          }
          return callback(null, salt.toString('base64'));
        });
      },

      /**
       * Encrypt password
       *
       * @param {String} password
       * @param {Function} callback
       * @return {String}
       * @api public
       */
      encryptPassword: function (password, callback) {
        if (!password || !this.salt) {
          if (!callback) {
            return null;
          }
          return callback(null);
        }

        var defaultIterations = 10000;
        var defaultKeyLength = 64;
        var salt = new Buffer(this.salt, 'base64');

        if (!callback) {
          return crypto2.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength)
            .toString('base64');
        }

        return crypto2.pbkdf2(password, salt, defaultIterations, defaultKeyLength,
          function (err, key) {
            if (err) {
              callback(err);
            }
            return callback(null, key.toString('base64'));
          });
      },

      /**
       * Update password field
       *
       * @param {Function} fn
       * @return {String}
       * @api public
       */
      updatePassword: function (fn) {
        // Handle new/update passwords
        if (this.password) {
          if (!this.password || !this.password.length) {
            fn(new Error('Invalid password'));
          }

          // Make salt with a callback
          var _this = this;
          this.makeSalt(function (saltErr, salt) {
            if (saltErr) {
              fn(saltErr);
            }
            _this.salt = salt;
            _this.encryptPassword(_this.password, function (encryptErr, hashedPassword) {
              if (encryptErr) {
                fn(encryptErr);
              }
              _this.password = hashedPassword;
              fn(null);
            });
          });
        } else {
          fn(null);
        }
      }
    }
  };

  return sequelizeInstance.define('User', attributes, options);
};
