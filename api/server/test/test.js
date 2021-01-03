const should = require('should');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const db = require('../src/models');
const moment = require('moment');
const expect = chai.expect
chai.use(chaiHttp);

const validEmail = 'foo@bar.com',
disposableEmail = 'foo+1@bar.com';

describe('Email endpints', () => {
    
    it('Should be able to add a valid email address', done => {
        chai.request(app)
        .post('/api/email')
        .set('Accept', 'application/json')
        .send({email: validEmail})
        .end((err, res) => {
            if (err) {
                done(err);
                return;
            }

            expect(res.status).to.equal(201);
            res.body.should.be.Object();
            expect(res.body).to.include({
                email: validEmail,
                status: 'ALLOWED'
            });
            done();
        });
    });

    it('Should add a disposable email address as RISKY', done => {
        chai.request(app)
        .post('/api/email')
        .set('Accept', 'application/json')
        .send({email: disposableEmail})
        .end((err, res) => {
            if (err) {
                done(err);
                return;
            }

            expect(res.status).to.equal(201);
            res.body.should.be.Object();
            expect(res.body).to.include({
                email: disposableEmail,
                status: 'RISKY'
            });
            done();
        });
    });

    it('Should NOT be able to add a valid-existing email address', done => {
        const validExistingEmail = 'foo@bar.com'
        chai.request(app)
        .post('/api/email')
        .set('Accept', 'application/json')
        .send({email: validExistingEmail})
        .end((err, res) => {
            if (err) {
                done(err);
                return;
            }

            expect(res.status).to.equal(422);
            done();
        });
    });

    it('Should NOT be able to add when email address is null', done => {
        chai.request(app)
        .post('/api/email')
        .set('Accept', 'application/json')
        .send({email: null})
        .end((err, res) => {
            if (err) {
                done(err);
                return;
            }

            expect(res.status).to.equal(422);
            done();
        });
    });

    it('Should NOT be able to add when email address is empty', done => {
        chai.request(app)
        .post('/api/email')
        .set('Accept', 'application/json')
        .send({email: ''})
        .end((err, res) => {
            if (err) {
                done(err);
                return;
            }

            expect(res.status).to.equal(422);
            done();
        });
    });

    it('Should NOT be able to add when email address is missing', done => {
        chai.request(app)
        .post('/api/email')
        .set('Accept', 'application/json')
        .send()
        .end((err, res) => {
            if (err) {
                done(err);
                return;
            }

            expect(res.status).to.equal(422);
            done();
        });
    });

    it('Should NOT be able to add when email address is invalid', done => {
        chai.request(app)
        .post('/api/email')
        .set('Accept', 'application/json')
        .send({email: 'foo'})
        .end((err, res) => {
            if (err) {
                done(err);
                return;
            }

            expect(res.status).to.equal(422);
            done();
        });
    });

    it('Should be able to get status of valid email address', done => {
        chai.request(app)
        .get(`/api/email/${validEmail}/status`)
        .set('Accept', 'application/json')
        .end((err, res) => {
            if (err) {
                done(err);
                return;
            }

            expect(res.status).to.equal(200);
            res.body.should.be.Object();
            expect(res.body).to.include({
                status: 'ALLOWED'
            });
            done();
        });
    });

    it('Should NOT  be able to get status of a non-existing email address', done => {
        chai.request(app)
        .get(`/api/email/nonexisting%40mail.com/status`)
        .set('Accept', 'application/json')
        .end((err, res) => {
            if (err) {
                done(err);
                return;
            }

            expect(res.status).to.equal(404);
            done();
        });
    });

    it('Should mark status as RISKY when get-status is called more than the threshold', done => {
        const data = [];
        for(let i = 0; i < 10; i++) {
            data.push({email: validEmail, last_requested: moment()});
        }
        db.EmailStatusRequest.bulkCreate(data).then(() => {
            chai.request(app)
                .get(`/api/email/${validEmail}/status`)
                .set('Accept', 'application/json')
                .end((err, res) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    expect(res.status).to.equal(200);
                    res.body.should.be.Object();
                    expect(res.body).to.include({
                        status: 'RISKY'
                    });
                    done();
                });
        }).catch(err => done(err));
    });

    it('Should be able to update status of a valid email address', done => {
        const updatedStatus = 'ALLOWED';
        chai.request(app)
        .patch(`/api/email/${validEmail}/status/${updatedStatus}`)
        .set('Accept', 'application/json')
        .send({email: validEmail})
        .end((err, res) => {
            if (err) {
                done(err);
                return;
            }

            expect(res.status).to.equal(200);
            res.body.should.be.Object();
            expect(res.body).to.include({
                status: updatedStatus
            });
            done();
        });
    });

    it('Should NOT be able to update status of a non-existing email address', done => {
        const updatedStatus = 'ALLOWED';
        chai.request(app)
        .patch(`/api/email/invalid%40mail.com/status/${updatedStatus}`)
        .set('Accept', 'application/json')
        .send({email: validEmail})
        .end((err, res) => {
            if (err) {
                done(err);
                return;
            }

            expect(res.status).to.equal(404);
            done();
        });
    });

    it('Should be able to delete a valid email address', done => {
        const updatedStatus = 'ALLOWED';
        chai.request(app)
        .delete(`/api/email/${validEmail}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
            if (err) {
                done(err);
                return;
            }

            expect(res.status).to.equal(204);
            done();
        });
    });

    it('Should NOT be able to add get status of a deleted valid email address', done => {
        chai.request(app)
        .get(`/api/email/${validEmail}/status`)
        .set('Accept', 'application/json')
        .end((err, res) => {
            if (err) {
                done(err);
                return;
            }

            expect(res.status).to.equal(404);
            done();
        });
    });

    it('Should be able to re-add a deleted valid email address', done => {
        chai.request(app)
        .post('/api/email')
        .send({email: validEmail})
        .set('Accept', 'application/json')
        .end((err, res) => {
            if (err) {
                done(err);
                return;
            }

            expect(res.status).to.equal(201);
            res.body.should.be.Object();
            expect(res.body).to.include({
                email: validEmail,
                status: 'ALLOWED',
                deleted_at: null
            });
            done();
        });
    });
});