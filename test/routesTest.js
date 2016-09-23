'use strict';

const Routes = require('../lib/routes');

const Vision = require('vision');
const Inert = require('inert');
const Hapi = require('hapi');
const Code = require('code');
const Lab = require('lab');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

const internals = {
    authorsApi: '/authors',
    booksApi: '/books'
};

internals.authorsApiId = `${internals.authorsApi}/1`;
internals.booksApiId = `${internals.booksApi}/1`;
internals.authorsApiIdErr = `${internals.authorsApi}/foo`;
internals.booksApiIdErr = `${internals.booksApi}/foo`;

internals.handler = function (route, options) {

    return function (request, reply) {

        return reply({
            action: options.action,
            context: options.context
        });
    };
};

internals.server = new Hapi.Server();
internals.server.connection();
internals.server.register([Inert, Vision]);
internals.server.handler('authors', internals.handler);
internals.server.handler('books', internals.handler);
internals.server.handler('users', internals.handler);
internals.server.handler('www', internals.handler);
internals.server.route(Routes.authorRoute);
internals.server.route(Routes.bookRoute);
internals.server.route(Routes.userRoute);
internals.server.route(Routes.wwwRoute);

internals.runTests = function (tests) {

    for (let i = 0; i < tests.length; ++i) {

        const test = tests[i];
        const request = test.request;

        it(`accepts ${request.method} ${request.url}`, (done) => {

            internals.server.inject(request, (res) => {

                expect(res.statusCode).to.equal(test.statusCode);
                expect(res.result).to.equal(test.result);

                return done();
            });
        });
    }
};

internals.authorRouteTests = [
    {
        request: { method: 'get', url: internals.authorsApi },
        result: { action: 'browse', context: undefined },
        statusCode: 200
    },
    {
        request: { method: 'get', url: internals.authorsApiId },
        result: { action: 'read', context: undefined },
        statusCode: 200
    },
    {
        request: { method: 'get', url: internals.authorsApiIdErr },
        result: { action: 'read', context: undefined },
        statusCode: 200
    },
    {
        request: { method: 'get', url: `${internals.authorsApiId}/books` },
        result: { action: 'browse', context: 'books' },
        statusCode: 200
    }
];

internals.bookRouteTests = [
    {
        request: { method: 'get', url: internals.booksApi },
        result: { action: 'browse', context: undefined },
        statusCode: 200
    },
    {
        request: { method: 'get', url: internals.booksApiId },
        result: { action: 'read', context: undefined },
        statusCode: 200
    },
    {
        request: { method: 'get', url: internals.booksApiIdErr },
        result: { action: 'read', context: undefined },
        statusCode: 200
    }
];

internals.userRouteTests = [];

internals.wwwRouteTests = [
    {
        request: { method: 'get', url: '/' },
        result: { action: undefined, context: undefined },
        statusCode: 200
    }
];

describe('lib/routes/authorRoute', () => {

    internals.runTests(internals.authorRouteTests);
});

describe('lib/routes/bookRoute', () => {

    internals.runTests(internals.bookRouteTests);
});

describe('lib/routes/userRoute', () => {

    internals.runTests(internals.userRouteTests);
});

describe('lib/routes/wwwRoute', () => {

    internals.runTests(internals.wwwRouteTests);
});
