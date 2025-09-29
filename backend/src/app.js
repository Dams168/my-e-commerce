import 'dotenv/config';
import express from 'express';
import { errorMiddleware } from './middleware/error-middleware.js';
import { publicRouter } from './router/public-api.js';
import { apiRouter } from './router/api.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './docs/swagger.json' with { type: 'json' };
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use('/api', apiRouter)
app.use('/api', publicRouter)
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(errorMiddleware);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});