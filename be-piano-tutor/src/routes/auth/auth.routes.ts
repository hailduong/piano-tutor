import {Router} from 'express'
import * as AuthController from '@src/routes/auth/auth.controller'
import {
  validateRegister,
  validateLogin,
  validatePasswordResetRequest,
  validatePasswordResetConfirm
} from '@src/middleware/validators'

const router: Router = Router()

/* Refs: Authentication routes with integrated input validations */

// User registration endpoint with validations.
router.post('/register', validateRegister, AuthController.register)

// User login endpoint with validations.
router.post('/login', validateLogin, AuthController.login)

// User logout endpoint (no input validation required).
router.post('/logout', AuthController.logout)

// Initiate password reset request with email validation.
router.post(
  '/password-reset/request',
  validatePasswordResetRequest,
  AuthController.passwordResetRequest
)

// Confirm password reset with token and new password validation.
router.post(
  '/password-reset/confirm',
  validatePasswordResetConfirm,
  AuthController.passwordResetConfirm
)

export default router
