import express from 'express';
import routes from './routes';
import dotenv from 'dotenv';
import connectDB from './config/dbConn';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3500;

connectDB();
routes(app);

mongoose.connection.once('open', () => {
    console.log('Connected to the Database');
    app.listen(PORT, () =>
        console.log(`Server running on http://localhost:${PORT}`)
    );
});
