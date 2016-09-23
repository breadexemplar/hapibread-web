'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Handlebars = require('handlebars');

const Config = require('./config');
const Models = require('./models');
const Handlers = require('./handlers');
const Routes = require('./routes');

const server = new Hapi.Server(Config.options);

server.connection({ port: Config.port });

server.register([Inert, Vision]);

server.views({ engines: { hbs: Handlebars }, path: Config.templates });

server.method(Models.authorModel);
server.method(Models.bookModel);
server.method(Models.userModel);

server.ext('onPostHandler', Handlers.postHandler);

server.handler('authors', Handlers.authorHandler);
server.handler('books', Handlers.bookHandler);
server.handler('users', Handlers.userHandler);
server.handler('www', Handlers.wwwHandler);

server.route(Routes.authorRoute);
server.route(Routes.bookRoute);
server.route(Routes.userRoute);
server.route(Routes.wwwRoute);


module.exports = server;
