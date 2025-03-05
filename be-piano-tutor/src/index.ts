import morgan from 'morgan'
import path from 'path'
import helmet from 'helmet'
import express, {Request, Response, NextFunction} from 'express'
import logger from 'jet-logger'

import 'express-async-errors'

import BaseRouter from '@src/routes'
import Paths from '@src/common/Paths'
import ENV from '@src/common/ENV'
import HttpStatusCodes from '@src/common/HttpStatusCodes'
import {RouteError} from '@src/common/route-errors'
import {NodeEnvs} from '@src/common/constants'

/******************************************************************************
 Setup
 ******************************************************************************/

const app = express()

// **** Middleware **** //

// Parse JSON and URL-encoded payloads
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Log HTTP requests in development
if (ENV.NodeEnv === NodeEnvs.Dev) {
  app.use(morgan('dev'))
}

// Apply security headers in production
if (ENV.NodeEnv === NodeEnvs.Production) {
  app.use(helmet())
}

// Add API routes after middleware setup
// Future endpoints (including authentication, registration, etc.) can be mounted here
app.use(Paths.Base, BaseRouter)

/* Error Handler */
// Global error handling middleware.
// If the error is recognized as a RouteError, use its status and message;
// otherwise, default to a 400 error response.
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  // Log error if not in test mode
  if (ENV.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true)
  }
  // Check for a known route error type and respond accordingly
  if (err instanceof RouteError) {
    return res.status(err.status).json({error: err.message})
  }
  // For any other errors, respond with a generic message
  return res.status(HttpStatusCodes.BAD_REQUEST).json({error: err.message})
})

/******************************************************************************
 FrontEnd Content
 ******************************************************************************/

// Set the directory for HTML views
const viewsDir = path.join(__dirname, 'views')
app.set('views', viewsDir)

// Serve static files (JavaScript, CSS, etc.) from the public directory
const staticDir = path.join(__dirname, 'public')
app.use(express.static(staticDir))

// Redirect the base route to the users page. Future refactoring can replace this behavior
app.get('/', (_: Request, res: Response) => {
  return res.redirect('/users')
})

// Serve the users page; later this can be protected with authentication checks
app.get('/users', (_: Request, res: Response) => {
  return res.sendFile('users.html', {root: viewsDir})
})

/******************************************************************************
 Export default
 ******************************************************************************/

export default app
