import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { specs } from './swagger.ts';
import authRouter from './routes/authRouter.ts';
import bookRouter from './routes/bookRouter.ts';
import loanRouter from './routes/loanRoutes.ts';
import roleRouter from './routes/roleRoutes.ts';
import { globalErrorHandler } from './middlewares/errorHandler.ts';


const app = express();

app.use(express.json());

// Routes
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/auth', authRouter);
app.use('/books', bookRouter);
app.use('/loans', loanRouter);
app.use('/roles', roleRouter);


// Global Error Handler must be at the very bottom
app.use(globalErrorHandler);

export { app };