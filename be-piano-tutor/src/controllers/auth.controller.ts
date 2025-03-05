import { Request, Response } from 'express';
import { AuthService } from '@src/services/auth.service';

export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    await AuthService.registerUser({ email, password });
    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to register user.' });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    // Retrieve user details along with the JWT token
    const { token } = await AuthService.loginUser({ email, password });
    return res.status(200).json({ message: 'Login successful.', token });
  } catch (error: any) {
    return res.status(401).json({ error: error.message || 'Invalid credentials.' });
  }
};

export const logout = async (_req: Request, res: Response): Promise<Response> => {
  try {
    // (Stub) Logout implementation: For JWT-managed sessions, client discards token.
    return res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to logout.' });
  }
};

export const passwordResetRequest = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }
    await AuthService.requestPasswordReset({ email });
    return res.status(200).json({ message: 'Password reset link has been sent to your email.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to process password reset request.' });
  }
};

export const passwordResetConfirm = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required.' });
    }
    await AuthService.resetPassword({ token, newPassword });
    return res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to reset password.' });
  }
};
