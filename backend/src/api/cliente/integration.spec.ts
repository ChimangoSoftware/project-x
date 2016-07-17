let request = require('supertest');
let app = require('../..');

import ClienteDao = require('./cliente.dao');

declare let expect: Sinon.SinonExpectation;

describe.only('Cliente API:', () => {
    let clienteDao = new ClienteDao();
    let token: string;
    let aux_token: string;

    before((done) => {
        clienteDao.model.sync()
            .then(() => done())
            .catch((err) => console.log('Error al intentar sincronizar tabla Cliente', err));
    });

    /* auth request
      before(function (done) {
        request(app)
            .post('/auth/local')
            .send({
                email: 'test@example.com',
                password: 'password'
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                token = res.body.token;
                done();
            });
    });*/

    beforeEach((done) => {
        return clienteDao.model.destroy({ where: {} })
            .then(() => done())
            .catch((err) => console.log('Error al intentar vaciar la tabla Cliente', err));
    });

    // ========================================
    // si se quiere agregar el token al request
    // .set('authorization', 'Bearer ' + token)
    // ========================================


    describe('create', () => {

    });


    describe('list', function () {
        it('should respond with an list of clients', (done) => {
            request(app)
                .post('/api/service')
                .send({
                    service: 'clienteService',
                    operation: 'list'
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(res.body.length).to.equal(0);
                    done();
                });
        });
    });
});
