'use strict';

const Handlers = require('../lib/handlers');

const Handlebars = require('handlebars');
const Vision = require('vision');
const Inert = require('inert');
const Hapi = require('hapi');
const Code = require('code');
const Lab = require('lab');

const lab = exports.lab = Lab.script();
const beforeEach = lab.beforeEach;
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

const internals = {
    server: new Hapi.Server({ connections: { routes: { files: { relativeTo: `${process.cwd()}/test/templates` } } } }),
    authorModel: { err: null, res: null },
    bookModel: { err: null, res: null }
};

internals.testAuthorModel = function () {

    return arguments[arguments.length - 1](internals.authorModel.err, internals.authorModel.res);
};

internals.testBookModel = function () {

    return arguments[arguments.length - 1](internals.bookModel.err, internals.bookModel.res);
};

internals.authorsPath = '/authors';
internals.booksPath = '/books';
internals.authorsIdPath = `${internals.authorsPath}/{id}`;
internals.booksIdPath = `${internals.booksPath}/{id}`;

internals.methods = [
    { method: internals.testAuthorModel, name: 'author.browse' },
    { method: internals.testAuthorModel, name: 'author.read' },
    { method: internals.testBookModel, name: 'book.browse' },
    { method: internals.testBookModel, name: 'book.read' }
];

internals.server.connection();
internals.server.register([Inert, Vision]);
internals.server.views({ engines: { hbs: Handlebars }, path: `${process.cwd()}/test/templates` });
internals.server.method(internals.methods);
internals.server.ext('onPostHandler', Handlers.postHandler);
internals.server.handler('authors', Handlers.authorHandler);
internals.server.handler('books', Handlers.bookHandler);
internals.server.handler('users', Handlers.userHandler);
internals.server.handler('www', Handlers.wwwHandler);
internals.server.route([
    { path: internals.authorsPath, method: 'get', handler: { authors: { action: 'browse' } } },
    { path: internals.authorsIdPath, method: 'get', handler: { authors: { action: 'read' } } },
    { path: `${internals.authorsIdPath}/books`, method: 'get', handler: { authors: { action: 'browse', context: 'books' } } },
    { path: `/foo${internals.authorsPath}`, method: 'get', handler: { authors: { action: 'foobar' } } },
    { path: internals.booksPath, method: 'get', handler: { books: { action: 'browse' } } },
    { path: internals.booksIdPath, method: 'get', handler: { books: { action: 'read' } } },
    { path: `/foo${internals.booksPath}`, method: 'get', handler: { books: { action: 'foobar' } } },
    { path: '/', method: 'get', handler: { www: {} } },
    { path: '/{any*}', method: '*', handler: { directory: { path: './', index: true, redirectToSlash: true } } }
]);

internals.runTests = function (tests) {

    for (let i = 0; i < tests.length; ++i) {

        const test = tests[i];
        const request = test.request;
        const bookErr = test.bookModel && test.bookModel.err;
        const authorErr = test.authorModel && test.authorModel.err;

        request.url = request.url.replace('{id}', '1');

        it(`handles ${request.method} ${request.url} - author err:${authorErr} book err:${bookErr}`, (done) => {

            internals.authorModel = test.authorModel;
            internals.bookModel = test.bookModel;
            internals.server.inject(request, (res) => {

                expect(res.statusCode).to.equal(test.statusCode);
                expect(res.result).to.equal(test.result);

                return done();
            });
        });
    }
};

internals.errors = {};

internals.authorHandlerTests = [
    {
        request: { url: internals.authorsPath, method: 'get' },
        authorModel: { err: null, res: 'x' },
        result: 'x\n',
        statusCode: 200
    },
    {
        request: { url: `${internals.authorsPath}?find=a`, method: 'get' },
        authorModel: { err: null, res: 'x' },
        result: 'x\n',
        statusCode: 200
    },
    {
        request: { url: internals.authorsPath, method: 'get' },
        authorModel: { err: true, res: null },
        result: 'Bad Implementation\n',
        statusCode: 500
    },
    {
        request: { url: internals.authorsIdPath, method: 'get' },
        authorModel: { err: null, res: 'x' },
        result: 'x\n',
        statusCode: 200
    },
    {
        request: { url: internals.authorsIdPath, method: 'get' },
        authorModel: { err: null, res: null },
        result: 'Not Found\n',
        statusCode: 404
    },
    {
        request: { url: internals.authorsIdPath, method: 'get' },
        authorModel: { err: true, res: null },
        result: 'Bad Implementation\n',
        statusCode: 500
    },
    {
        request: { url: `${internals.authorsIdPath}/books`, method: 'get' },
        bookModel: { err: null, res: 'x' },
        result: 'x\n',
        statusCode: 200
    },
    {
        request: { url: `${internals.authorsIdPath}/books?find=a`, method: 'get' },
        bookModel: { err: null, res: 'x' },
        result: 'x\n',
        statusCode: 200
    },
    {
        request: { url: `${internals.authorsIdPath}/books`, method: 'get' },
        bookModel: { err: true, res: null },
        result: 'Bad Implementation\n',
        statusCode: 500
    }
];

internals.bookHandlerTests = [
    {
        request: { url: internals.booksPath, method: 'get' },
        bookModel: { err: null, res: 'x' },
        result: 'x\n',
        statusCode: 200
    },
    {
        request: { url: `${internals.booksPath}?find=a`, method: 'get' },
        bookModel: { err: null, res: 'x' },
        result: 'x\n',
        statusCode: 200
    },
    {
        request: { url: internals.booksPath, method: 'get' },
        bookModel: { err: true, res: null },
        result: 'Bad Implementation\n',
        statusCode: 500
    },
    {
        request: { url: internals.booksIdPath, method: 'get' },
        bookModel: { err: null, res: 'x' },
        result: 'x\n',
        statusCode: 200
    },
    {
        request: { url: internals.booksIdPath, method: 'get' },
        bookModel: { err: null, res: null },
        result: 'Not Found\n',
        statusCode: 404
    },
    {
        request: { url: internals.booksIdPath, method: 'get' },
        bookModel: { err: true, res: null },
        result: 'Bad Implementation\n',
        statusCode: 500
    }
];

internals.userHandlerTests = [];

internals.wwwHandlerTests = [
    {
        request: { url: '/', method: 'get' },
        result: 'index\n',
        statusCode: 200
    }
];

beforeEach((done) => {

    internals.authorModel = { err: null, res: null };
    internals.bookModel = { err: null, res: null };

    return done();
});

describe('lib/handlers.authors', () => {

    internals.runTests(internals.authorHandlerTests);
});

describe('lib/handlers.books', () => {

    internals.runTests(internals.bookHandlerTests);
});

describe('lib/handlers.users', () => {

    internals.runTests(internals.userHandlerTests);
});

describe('lib/handlers.www', () => {

    internals.runTests(internals.wwwHandlerTests);
});
