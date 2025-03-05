import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

/* Refs: Validators for authentication endpoints */

/* Handlers */
// Validator middleware to check for errors after express-validator checks.
export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
};

/* Validation chains for each auth endpoint */

// Validate registration inputs: email format and password minimum length.
export const validateRegister = [
  body('email').isEmail().withMessage('A valid email is required.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
  validateRequest,
];

// Validate login inputs: required email and password.
export const validateLogin = [
  body('email').isEmail().withMessage('A valid email is required.'),
  body('password').notEmpty().withMessage('Password is required.'),
  validateRequest,
];

// Validate password reset request: ensure email is valid.
export const validatePasswordResetRequest = [
  body('email').isEmail().withMessage('A valid email is required.'),
  validateRequest,
];

// Validate password reset confirmation: token and new password provided.
export const validatePasswordResetConfirm = [
  body('token').notEmpty().withMessage('Reset token is required.'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long.'),
  validateRequest,
];
