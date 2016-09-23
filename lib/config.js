'use strict';


module.exports = {
    // $lab:coverage:off$
    port: process.env.PORT || 8081,
    apiURL: process.env.API_URL || 'http://localhost:8080/v0',
    postgresURL: process.env.POSTGRES_URL || 'postgres://postgres:postgres@localhost/postgres',
    // $lab:coverage:on$
    templates: `${process.cwd()}/lib/templates`,
    options: { connections: { routes: { files: { relativeTo: `${process.cwd()}/app` } } } },
    defaults: {
        order: 'asc',
        page: 1,
        perpage: 20,
        sort: {
            author: 'penName',
            book: 'title'
        }
    }
};
