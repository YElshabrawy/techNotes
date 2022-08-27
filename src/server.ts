import express from 'express';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 3500;

routes(app);

app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);
