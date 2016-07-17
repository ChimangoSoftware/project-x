import ClienteDao = require('./Cliente.dao');

declare let assert: Chai.Assert;
declare let expect: Chai.ExpectStatic;

describe('ClienteDao', () => {

    let clienteDao = new ClienteDao();
    let testCliente: model.Cliente = {
        nombre: 'nombre',
        apellido: 'apellido',
        tipoDocumento: enums.tipoDocumento.DNI,
        numeroDocumento: 30123456,
        sexo: enums.sexo.M
    };

    before((done) => {
        clienteDao.model.sync()
            .then(() => done())
            .catch((err) => console.log('Error al intentar sincronizar tabla Cliente', err));
    });

    beforeEach((done) => {
        clienteDao.model.destroy({ where: {} })
            .then(() => done())
            .catch((err) => console.log('Error al intentar vaciar la tabla Cliente', err));
    });

    it('should create a client', (done) => {
        let createPromise = clienteDao.create(testCliente);
        createPromise.then((dbCliente) => {
            expect(dbCliente._id).not.to.be.null;
            done();
        });
        createPromise.catch((err) => console.log('Error al crear el cliente', err));
    });

    it('should list all clients', (done) => {
        let createPromise = clienteDao.create(testCliente);
        createPromise.then((dbCliente) => {
            expect(dbCliente._id).not.to.be.null;
            let findPromise = clienteDao.list();
            findPromise.then((findedCliente) => {
                expect(findedCliente.length).to.equal(1);
                done();
            });
            findPromise.catch((err) => console.log('Error al buscar los cliente', err));
        });
        createPromise.catch((err) => console.log('Error al crear el cliente', err));
    });

    it('should find a client by his ID', (done) => {
        let createPromise = clienteDao.create(testCliente);
        createPromise.then((dbCliente) => {
            expect(dbCliente._id).not.to.be.null;
            let findPromise = clienteDao.getById(dbCliente._id);
            findPromise.then((findedCliente) => {
                expect(findedCliente._id).to.equal(dbCliente._id);
                done();
            });
            findPromise.catch((err) => console.log('Error al buscar el cliente', err));
        });
        createPromise.catch((err) => console.log('Error al crear el cliente', err));
    });

    it('should update a client', (done) => {
        let createPromise = clienteDao.create(testCliente);
        createPromise.then((dbCliente) => {
            expect(dbCliente._id).not.to.be.null;
            dbCliente.nombre = 'nombre2';
            let updatePromise = clienteDao.update(dbCliente);
            updatePromise.then((findedCliente) => {
                expect(findedCliente.nombre).to.equal('nombre2');
                done();
            });
            updatePromise.catch((err) => console.log('Error al actualizar el cliente', err));
        });
        createPromise.catch((err) => console.log('Error al crear el cliente', err));
    });

    it('should delete a client', (done) => {
        let createPromise = clienteDao.create(testCliente);
        createPromise.then((dbCliente) => {
            expect(dbCliente._id).not.to.be.null;
            let deletePromise = clienteDao.delete(dbCliente._id);
            deletePromise.then((deleteResponse) => {
                expect(deleteResponse.result).to.equal(true);
                done();
            });
            deletePromise.catch((err) => console.log('Error al eliminar el cliente', err));
        });
        createPromise.catch((err) => console.log('Error al crear el cliente', err));
    });
});
