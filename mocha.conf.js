var chai = require('chai');
var sinon = require('sinon')

global.expect = chai.expect;
global.assert = chai.assert;
global.sinon = sinon;
chai.should();

// Initialize Chai plugins
chai.use(require('sinon-chai'));
chai.use(require('chai-as-promised'));
chai.use(require('chai-things'))
