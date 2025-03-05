import {Router} from 'express'
import authRoutes from './auth.routes'

/* Refs:
   Base Router that combines all sub-route modules.
   Ensure that all API endpoints are mounted here.
*/

const router: Router = Router()

/* Routes Integration */
// Mount the authentication routes under "/api/auth" for all auth-related endpoints.
router.use('/api/auth', authRoutes)

/* Future expansion:
   Additional route modules for other features can be mounted here.
*/

export default router
