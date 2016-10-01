'use strict';

const Boom = require('boom');


exports.postHandler = function (request, reply) {

    const response = request.response;

    if (response.isBoom) {

        // $lab:coverage:off$
        if (response.output.statusCode >= 500) {

            return reply.file('50x.html').code(500);
        }

        if (response.output.statusCode >= 400) {

            return reply.file('404.html').code(404);
        }
        // $lab:coverage:on$
    }

    return reply.continue();
};


exports.authorHandler = function (route, options) {

    if (options.action === 'browse') {

        if (options.context === 'books') {

            return function (request, reply) {

                const query = request.query;

                return request.server.methods.book.browse(query.sort, query.order, query.page, query.perpage, query.find || '', request.params.id, (err, results) => {

                    if (err) {
                        request.server.log(['error'], err);

                        return reply(Boom.badImplementation());
                    }

                    return reply.view('authors', { authors: results });
                });
            };
        }

        return function (request, reply) {

            const query = request.query;

            return request.server.methods.author.browse(query.sort, query.order, query.page, query.perpage, query.find || '', (err, results) => {

                if (err) {
                    request.server.log(['error'], err);

                    return reply(Boom.badImplementation());
                }

                return reply.view('authors', { authors: results });
            });
        };
    }
    else if (options.action === 'read') {

        return function (request, reply) {

            return request.server.methods.author.read(request.params.id, (err, result) => {

                if (err) {

                    return reply(Boom.badImplementation());
                }

                if (!result) {

                    return reply(Boom.notFound());
                }

                return reply.view('author', { author: result });
            });
        };
    }
};


exports.bookHandler = function (route, options) {

    if (options.action === 'browse') {

        return function (request, reply) {

            const query = request.query;

            return request.server.methods.book.browse(query.sort, query.order, query.page, query.perpage, query.find || '', null, (err, results) => {

                if (err) {
                    request.server.log(['error'], err);

                    return reply(Boom.badImplementation());
                }

                return reply.view('books', { books: results });
            });
        };
    }
    else if (options.action === 'read') {

        return function (request, reply) {

            return request.server.methods.book.read(request.params.id, (err, result) => {

                if (err) {
                    request.server.log(['error'], err);

                    return reply(Boom.badImplementation());
                }

                if (!result) {

                    return reply(Boom.notFound());
                }

                return reply.view('book', { book: result });
            });
        };
    }
};


exports.userHandler = function () {
};


exports.wwwHandler = function () {

    return function (request, reply) {

        return reply.view('index');
    };
};
