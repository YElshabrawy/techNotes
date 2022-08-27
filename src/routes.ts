import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import corsOptions from './config/corsOptions';

import indexRouter from './routers/indexRouter';

export default (app: express.Application) => {
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(cookieParser());
    app.use('/', express.static(path.join(__dirname, '..', 'public'))); // Link css and assets

    // Routes
    app.use('/', indexRouter);

    // 404 Requests
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
