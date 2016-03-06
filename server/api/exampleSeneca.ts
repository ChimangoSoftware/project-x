module.exports = function example(options) {

    this.add('role:math,cmd:echo', function sum(msg, respond) {
        respond(null, { answer: msg.text + msg.data });
    });

    this.wrap('role:math', function (msg, respond) {
        msg.text = 'this is an example: ';
        this.prior(msg, respond);
    });

};
