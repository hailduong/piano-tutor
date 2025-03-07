import {Router} from 'express'
import authController from '@src/routes/auth/auth.controller'
import {
  validateRegister,
  validateLogin,
  validatePasswordResetRequest,
  validatePasswordResetConfirm
} from '@src/middleware/validators'

const router: Router = Router()

// User registration endpoint with validations.
router.post('/register', validateRegister, authController.register)

// User login endpoint with validations.
router.post('/login', validateLogin, authController.login)

// User logout endpoint (no input validation required).
router.post('/logout', authController.logout)

// Initiate password reset request with email validation.
router.post(
  '/password-reset/request',
  validatePasswordResetRequest,
  authController.passwordResetRequest
)

// Confirm password reset with token and new password validation.
router.post(
  '/password-reset/confirm',
  validatePasswordResetConfirm,
  authController.passwordResetConfirm
)

export default router
