'use strict';

const Joi = require('joi');


module.exports = {
    id: Joi.number().integer().positive().required().max(10000000),
    page: Joi.number().integer().positive().required().max(100000).default(1),
    perPage: Joi.number().integer().positive().required().max(100).default(10),
    find: Joi.string().max(100),
    order: Joi.string().insensitive().required().valid('asc', 'desc').default('asc'),
    authorSort: Joi.string().insensitive().required().valid('penName', 'lastName', 'firstName').default('penName'),
    bookSort: Joi.string().insensitive().required().valid('title', 'isbn10', 'isbn13', 'author').default('title')
};
