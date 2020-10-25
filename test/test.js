process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();

chai.use(chaiHttp);

describe('Register', () => {
    describe('POST /register', () => {
        it('Test to register with new user', (done) => {
            chai.request(server)
                .post("/register")
                .send({ usr: 'test', psw: 'test'})
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("object");
                    done();
                });
        });
    });

    describe('POST /register', () => {
        it('Test to register with existing user', (done) => {
            chai.request(server)
                .post("/register")
                .send({ usr: 'test', psw: 'test'})
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("object");
                    done();
                });
        });
    });
});

describe('Login', () => {
    describe('POST /login', () => {
        it('Test to login with invalid user', (done) => {
            chai.request(server)
                .post("/login")
                .send({ usr: 'test1', psw: 'test'})
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.an("object");
                    done();
                });
        });
    });
});

describe('post routes', () => {
    var tests = [
        "/acc",
        "/purchase",
        "/balance",
    ];

    tests.forEach(function(test) {
        describe('POST' + test, () => {
            it('Testing post routes', (done) => {
                chai.request(server)
                    .post(test)
                    .end((err, res) => {
                        res.should.have.status(403);
                        res.body.data.should.be.an("object");
                        done();
                    });
            });
        });
    });
});

describe('Login', () => {
    describe('POST /login', () => {
        it('Test to login with valid user', (done) => {
            chai.request(server)
                .post("/login")
                .send({ usr: 'test', psw: 'test'})
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    done();
                });
        });
    });
});


describe('auth post routs', () => {
    var tests = [
        "/acc",
    ];

    tests.forEach(function(test) {
        let token = process.env.JWT_TOKEN;

        describe('POST' + test, () => {
            it('Testing post routes', (done) => {
                chai.request(server)
                    .post(test)
                    .set('x-access-token', token)
                    .send({ usr: 'test', psw: 'test', portfolio: [], balance: 0})
                    .end((err, res) => {
                        res.should.have.status(201);
                        done();
                    });
            });
        });
    });
});

describe('auth post routs', () => {
    var tests = [
        "/purchase",
        "/balance",
    ];

    tests.forEach(function(test) {
        let token = process.env.JWT_TOKEN;

        describe('POST' + test, () => {
            it('Testing post routes', (done) => {
                chai.request(server)
                    .post(test)
                    .set('x-access-token', token)
                    .send({ usr: 'test', psw: 'test', portfolio: [], balance: 0})
                    .end((err, res) => {
                        res.should.have.status(201);
                        done();
                    });
            });
        });
    });
});
