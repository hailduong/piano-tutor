import morgan from 'morgan';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';

import 'express-async-errors';

import BaseRouter from '@src/routes';
import ENV from '@src/common/ENV';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { RouteError } from '@src/common/route-errors';
import { NodeEnvs } from '@src/common/constants';

/******************************************************************************
 Setup
 ******************************************************************************/

const app = express();

// **** Middleware **** //

// Parse JSON and URL-encoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log HTTP requests in development
if (ENV.NodeEnv === NodeEnvs.Dev) {
  app.use(morgan('dev'));
}

// Apply security headers in production
if (ENV.NodeEnv === NodeEnvs.Production) {
  app.use(helmet());
}

// Add API routes after middleware setup
app.use('/api', BaseRouter);

/* Error Handler */
// Global error handling middleware.
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  // Log error if not in test mode
  if (ENV.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }
  // Check for a known route error type and respond accordingly
  if (err instanceof RouteError) {
    return res.status(err.status).json({ error: err.message });
  }
  // For any other errors, respond with a generic message
  return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message });
});

/******************************************************************************
 Start server
 ******************************************************************************/

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
