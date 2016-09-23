'use strict';
/* eslint max-nested-callbacks: 0 */

const Proxyquire = require('proxyquire');
const Hapi = require('hapi');
const Code = require('code');
const Lab = require('lab');

const lab = exports.lab = Lab.script();
const beforeEach = lab.beforeEach;
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

const internals = { server: new Hapi.Server() };

internals.testRead = function (method, done) {

    internals.test.payload = 1;

    method(1, (err) => {

        expect(err).to.not.exist();

        method('a', (err, result) => {

            expect(err).to.not.exist();
            expect(result).to.not.exist();

            internals.test.res = null;

            method(1, (err) => {

                expect(err).to.exist();

                internals.test.res = { statusCode: 200 };

                method(1, (err, result) => {

                    expect(err).to.not.exist();
                    expect(result).to.exist();

                    internals.test.res = { statusCode: 500 };

                    method(1, (err) => {

                        expect(err).to.exist();

                        internals.test.res = { statusCode: 404 };

                        method(1, (err, result) => {

                            expect(err).to.not.exist();
                            expect(result).to.not.exist();

                            internals.test.res = { statusCode: 400 };

                            method(1, (err) => {

                                expect(err).to.exist();

                                internals.test.res = { statusCode: 400, statusMessage: 'foobar' };

                                method(1, (err) => {

                                    expect(err).to.exist();

                                    internals.test.err = true;

                                    method(1, (err) => {

                                        expect(err).to.exist();

                                        return done();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

internals.stub = {
    wreck: {
        get: function (path, next) {

            return next(internals.test.err, internals.test.res, internals.test.payload);
        }
    }
};

internals.models = Proxyquire('../lib/models', internals.stub);
internals.server.connection();
internals.server.method(internals.models.authorModel);
internals.server.method(internals.models.bookModel);
internals.server.method(internals.models.userModel);

beforeEach((done) => {

    internals.test = {
        err: null,
        res: { statusCode: 200 },
        payload: null
    };

    return done();
});

describe('lib/models.authors', () => {

    it('browse authors', (done) => {

        const method = internals.server.methods.author.browse;

        //    (sort, order, page, perpage, find,
        method(null, null, null, null, null, (err) => {

            expect(err).to.not.exist();

            method('penName', null, null, null, null, (err) => {

                expect(err).to.not.exist();

                method('penName', null, null, null, null, (err) => {

                    expect(err).to.not.exist();

                    method('penName', 'asc', null, null, null, (err) => {

                        expect(err).to.not.exist();

                        method('penName', 'asc', 1, null, null, (err) => {

                            expect(err).to.not.exist();

                            method('penName', 'asc', 1, 1, null, (err) => {

                                expect(err).to.not.exist();

                                method('penName', 'asc', 1, 1, 'a', (err) => {

                                    expect(err).to.not.exist();

                                    internals.test.res = null;

                                    method('penName', 'asc', 1, 1, 'a', (err) => {

                                        expect(err).to.exist();

                                        internals.test.res = { statusCode: 500 };

                                        method('penName', 'asc', 1, 1, 'a', (err) => {

                                            expect(err).to.exist();

                                            internals.test.res = { statusCode: 400, statusMessage: 'foobar' };

                                            method('penName', 'asc', 1, 1, 'a', (err) => {

                                                expect(err).to.exist();

                                                internals.test.err = true;

                                                method('penName', 'asc', 1, 1, 'a', (err) => {

                                                    expect(err).to.exist();

                                                    return done();
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    it('read authors', (done) => {

        return internals.testRead(internals.server.methods.author.read, done);
    });
});

describe('lib/models.books', () => {

    it('browse books', (done) => {

        const method = internals.server.methods.book.browse;

        //     sort, order, page, perpage, find, author,
        method(null, null, null, null, null, null, (err) => {

            expect(err).to.not.exist();

            method('title', null, null, null, null, null, (err) => {

                expect(err).to.not.exist();

                method('title', 'asc', null, null, null, null, (err) => {

                    expect(err).to.not.exist();

                    method('title', 'asc', 1, null, null, null, (err) => {

                        expect(err).to.not.exist();

                        method('title', 'asc', 1, 1, null, null, (err) => {

                            expect(err).to.not.exist();

                            method('title', 'asc', 1, 1, 'a', null, (err) => {

                                expect(err).to.not.exist();

                                method('title', 'asc', 1, 1, 'a', 1, (err) => {

                                    expect(err).to.not.exist();

                                    internals.test.res = null;

                                    method('title', 'asc', 1, 1, 'a', 1, (err) => {

                                        expect(err).to.exist();

                                        internals.test.res = { statusCode: 500 };

                                        method('title', 'asc', 1, 1, 'a', 1, (err) => {

                                            expect(err).to.exist();

                                            internals.test.res = { statusCode: 400, statusMessage: 'foobar' };

                                            method('title', 'asc', 1, 1, 'a', 1, (err) => {

                                                expect(err).to.exist();

                                                internals.test.err = true;

                                                method('title', 'asc', 1, 1, 'a', 1, (err) => {

                                                    expect(err).to.exist();

                                                    return done();
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    it('read books', (done) => {

        return internals.testRead(internals.server.methods.book.read, done);
    });
});

describe('lib/models.user', () => {

});
