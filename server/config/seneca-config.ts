module.exports = function config(app, seneca) {
    // List of services
    seneca.use('./api/cliente');

    // Start seneca client and server
    seneca.client({ port: 3000, pin: 'role: api'});
    app.use(seneca.export('web')).listen(3000);
};
