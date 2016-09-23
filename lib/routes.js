'use strict';


exports.authorRoute = [
    {
        path: '/authors',
        method: 'get',
        handler: { authors: { action: 'browse' } }
    },
    {
        path: '/authors/{id}',
        method: 'get',
        handler: { authors: { action: 'read' } }
    },
    {
        path: '/authors/{id}/books',
        method: 'get',
        handler: { authors: { action: 'browse', context: 'books' } }
    }
];


exports.bookRoute = [
    {
        path: '/books',
        method: 'get',
        handler: { books: { action: 'browse' } }
    },
    {
        path: '/books/{id}',
        method: 'get',
        handler: { books: { action: 'read' } }
    }
];


exports.userRoute = [];


exports.wwwRoute = [
    {
        path: '/',
        method: 'get',
        handler: { www: {} }
    },
    {
        path: '/{any*}',
        method: '*',
        handler: {
            directory: {
                path: './',
                index: true,
                redirectToSlash: true
            }
        }
    }
];
