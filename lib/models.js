'use strict';

const Wreck = require('wreck');

const Config = require('./config');
const Schemas = require('./schemas');

const internals = {
    browse: function (context, sort, order, page, perpage, find, next) {

        const qFind = Schemas.find.validate(find).error ? '' : find;
        const qOrder = Schemas.order.validate(order).error ? Config.defaults.order : order;
        const qPage = Schemas.page.validate(page).error ? Config.defaults.page : page;
        const qPerPage = Schemas.perPage.validate(perpage).error ? Config.defaults.perpage : perpage;

        Wreck.get(`${Config.apiURL}/${context}?find=${qFind}&order=${qOrder}&page=${qPage}&perpage=${qPerPage}&sort=${sort}`, (err, res, payload) => {

            if (err) {

                return next(err);
            }

            if (res) {
                if (res.statusCode === 200) {

                    return next(null, payload);
                }

                return next(res.statusMessage || true);
            }

            return next(new Error('No error and response'));
        });
    },
    read: function (context, id, next) {

        if (Schemas.id.validate(id).error) {

            return next();
        }

        Wreck.get(`${Config.apiURL}/${context}/${id}`, (err, res, payload) => {

            if (err) {

                return next(err);
            }

            if (res) {
                if (res.statusCode === 200) {

                    return next(null, payload);
                }
                else if (res.statusCode === 404) {

                    return next();
                }

                return next(res.statusMessage || true);
            }

            return next(new Error('No error and response'));
        });
    }
};


exports.authorModel = [
    {
        name: 'author.browse',
        method: function (sort, order, page, perpage, find, next) {

            const reSort = Schemas.authorSort.validate(sort).error ? Config.defaults.sort.author : sort;

            return internals.browse('authors', reSort, order, page, perpage, find, next);
        }
    },
    {
        name: 'author.read',
        method: function (id, next) {

            return internals.read('authors', id, next);
        }
    }
];


exports.bookModel = [
    {
        name: 'book.browse',
        method: function (sort, order, page, perpage, find, author, next) {

            const reSort = Schemas.bookSort.validate(sort).error ? Config.defaults.sort.book : sort;
            let context = 'books';
            if (author) {
                context = `authors/${author}/books`;
            }

            return internals.browse(context, reSort, order, page, perpage, find, next);
        }
    },
    {
        name: 'book.read',
        method: function (id, next) {

            return internals.read('books', id, next);
        }
    }
];


exports.userModel = [];
