
function SenecaService<TFunction extends Function>(pattern: any) {

  return function decorator(target: any) {

    target.getClass().serviceName = pattern.service;

    /*   target.getClass().client = function (seneca): TFunction {
         target.seneca = seneca;
         target.log = seneca.log;

         var client = {};
         var serviceMethods = getServiceMethods(target);

         serviceMethods.forEach(function (method) {
           var actionPattern = JSON.parse(JSON.stringify(pattern));

           actionPattern.action = method.methodName;
           client[method.methodName] = function (args, cb) {
             if (!cb && args instanceof Function) {
               cb = args;
               args = undefined;
             }
             if (!cb) {
               cb = function () { };
             }
             var param = getParamNames(method).shift();
             if (args != null && args !== undefined) {
               actionPattern[param] = args;
             }
             seneca.act(actionPattern, cb);
           };
         });

         return <TFunction>client;
       };
   */

    target.getClass().registerMethodsAsSenecaServices = function () {
      var args = [].slice.call(arguments);
      var instance = construct(target, args);

      return function (options) {
        var seneca = this;
        target.seneca = seneca;
        target.log = seneca.log;

        // register methods
        var serviceMethods = getServiceMethods(target);
        serviceMethods.forEach(function (method) {

          // get the annotated function object
          var actionPattern = JSON.parse(JSON.stringify(pattern));

          // operation is used to match the request with the method
          actionPattern.operation = method.methodName;

          // register in seneca
          seneca.add(actionPattern, function (args, callback) {
            var param = getParamNames(method).shift();
            var instanceMethod: any;

            // bind method
            if (args[param] != null && args[param] !== undefined) {
              instanceMethod = method.bind(instance, args[param]);
            } else {
              instanceMethod = method.bind(instance);
            }

            if (method.length > 0) {
              instanceMethod(function (err, value) {
                if (err) {
                  callback(err);
                } else {
                  //callback(null, { data: value });
                  callback(null, value);
                }
              });
            } else {
              instanceMethod();
              callback(null, { data: 'OK' });
            }
          });
        });

        // return the name of the class, is used by seneca.use()
        return target.name;
      };
    };

  };
}

function getObjectMethodsNames(obj) {
  var props = {};
  while (obj) {
    Object.getOwnPropertyNames(obj).forEach(function (p) {
      props[p] = true;
    });
    obj = Object.getPrototypeOf(obj);
  }
  return Object.getOwnPropertyNames(props);
}

function getServiceMethods(target) {
  var excludedMethods = [];
  excludedMethods.push('constructor');

  var methodNames = getObjectMethodsNames(target.prototype);

  var serviceMethodNames = methodNames.filter(function (method) {
    return excludedMethods.indexOf(method) === -1;
  });

  return serviceMethodNames.map((methodName) => {
    let method = target.prototype[methodName];
    method.methodName = methodName;
    return method;
  });
}

function construct(constr, args) {
  var instance = Object.create(constr.prototype);
  var result = constr.apply(instance, args);
  return typeof result === 'object' ? result : instance;
}

//http://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically-from-javascript
var STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|('(?:\\'|[^'\r\n])*'))|(\s*=[^,\)]*))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func) {
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if (result === null) {
    result = [];
  }
  return result;
}

export = SenecaService;
