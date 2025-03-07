import {Router} from 'express'
import authRoutes from 'src/routes/auth/auth.routes'


const router: Router = Router()
router.use('/auth', authRoutes)

export default router
