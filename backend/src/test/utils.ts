import sinon = require('sinon');

function generateMockFromService(name: string, methods?: string[]) {
  if (!methods) {
    return sinon.spy();
  }
}

function initializeService(service: any, mocks: any, senecaReadyCb?: Function): any {
  // Initialize Seneca
  let senecaError = undefined;
  let seneca = require('seneca')({
    log: 'quiet',
    strict: { result: false },
    errhandler: (err: any) => {
      senecaError = err;
      return false;
    }
  });

  // generate sinon.stubs
  let arrayOFStubs = generetateArrayStubs(mocks);

  // register service in seneca
  seneca.use(service.senecaService.apply(this, arrayOFStubs));
  let instantiedService = service.client(seneca);
  let count = 0;
  mocks.forEach((methods: string[], key: string) => {
    instantiedService[key] = arrayOFStubs[count];
    count++;
  });

  // cb for seneca ready
  if (senecaReadyCb) { seneca.ready(senecaReadyCb); }

  return {
    senecaError: senecaError,
    service: instantiedService
  };
}


function generetateArrayStubs(mocks: Map<string, string[]>): any[] {
  let arrayOFStubs = [];
  mocks.forEach((methods: string[]) => {
    let stub = generetateStubFromArray('', methods);
    arrayOFStubs.push(stub);
  });
  return arrayOFStubs;
}

function generetateStubFromArray(name: string, methods: string[]) {
  let stub = {};
  for (let index = 0; index < methods.length; index++) {
    let method = methods[index];
    stub[method] = sinon.stub();
  }
  return stub;
}

function getInjectionsProvider(): any {
  return new Map<string, string[]>();
}

export = {
  initializeService: initializeService,
  generetateStubsFromMap: generetateArrayStubs,
  generetateStubFromArray: generetateStubFromArray,
  getInjectionsProvider: getInjectionsProvider
};
