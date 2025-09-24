import express from 'express';
import { errorMiddleware } from './middleware/error-middleware.js';
import { publicRouter } from './router/public-api.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api', publicRouter)

app.use(errorMiddleware);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});