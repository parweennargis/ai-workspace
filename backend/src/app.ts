import express from 'express';
import routes from './routes';
import { requestIdMiddleware } from './middlewares/request-id';
import { requestLogger } from './middlewares/request-logger';
import { errorHandler } from './middlewares/error-handler';
import { responseLogger } from './middlewares/response-logger';

const app = express();

app.use(express.json());

// 1. Generate request ID first
app.use(requestIdMiddleware);

// 2. Log the request using that request ID
app.use(requestLogger);
app.use(responseLogger);

// 3. Health endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Workspace API is running',
  });
});

// 4. Application routes
app.use(routes);

// 5. Global error handler MUST be last
app.use(errorHandler);

export default app;