import express from 'express';
import path from 'path';

import indexRouter from './routers/indexRouter';

export default (app: express.Application) => {
    app.use('/', express.static(path.join(__dirname, '..', '/public'))); // To search for assets and css in this folder

    app.use('/', indexRouter);

    app.all('*', (req, res) => {
        res.status(404);
        if (req.accepts('html')) {
            res.sendFile(path.join(__dirname, 'views', '404.html'));
        } else if (req.accepts('json')) {
            res.json({ message: '404 Not Found' });
        } else {
            res.type('txt').send('404 Not Found');
        }
    });
};
