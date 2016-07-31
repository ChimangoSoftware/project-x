import ClienteService = require('./cliente.service');
import Promise = require('bluebird');

declare let assert: Chai.Assert;

let clienteDao: any = {
    create: () => { },
    list: () => { },
    getById: () => { },
    update: () => { },
    delete: () => { }
};

sinon.stub(clienteDao, 'create', () => Promise.resolve());
sinon.stub(clienteDao, 'list', () => Promise.resolve());
sinon.stub(clienteDao, 'getById', () => Promise.resolve());
sinon.stub(clienteDao, 'update', () => Promise.resolve());
sinon.stub(clienteDao, 'delete', () => Promise.resolve());

let clienteInstance: model.Cliente = {
    _id: 1,
    nombre: 'nombre',
    apellido: 'apellido',
    tipoDocumento: enums.tipoDocumento.DNI,
    numeroDocumento: 30123456,
    sexo: enums.sexo.M
};

describe('ClienteService', () => {
    let clienteService = new ClienteService(clienteDao);

    it('should call create funtion from clienteDao when create function is invoked', () => {
        clienteService.create(clienteInstance).then(() => {
            assert(clienteDao.create.calledOnce);
        });
    });

    it('should call list funtion from clienteDao when list function is invoked', () => {
        clienteService.list().then(() => {
            assert(clienteDao.list.calledOnce);
        });
    });

    it('should call getById funtion from clienteDao when getById function is invoked', () => {
        clienteService.getById(clienteDao._id).then(() => {
            assert(clienteDao.getById.withArgs(clienteDao._id).calledOnce);
        })
    });

    it('should call update funtion from clienteDao when update function is invoked', () => {
        clienteService.update(clienteDao).then(() => {
            assert(clienteDao.update.withArgs(clienteDao).calledOnce);
        })
    });

    it('should call delete funtion from clienteDao when delete function is invoked', () => {
        clienteService.delete(clienteDao._id).then(() => {
            assert(clienteDao.delete.withArgs(clienteDao._id).calledOnce);
        });
    });

});
