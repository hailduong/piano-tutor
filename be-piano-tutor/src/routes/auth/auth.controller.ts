import {Request, Response} from 'express'
import authService from '@src/routes/auth/auth.service'

class AuthController {
  public async register(req: Request, res: Response): Promise<Response> {
    try {
      const {email, password, firstName, lastName} = req.body
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({error: 'Email, password, first name and last name are required.'})
      }
      await authService.registerUser({email, password, firstName, lastName})
      return res.status(201).json({message: 'User registered successfully.'})
    } catch (error: any) {
      return res.status(500).json({error: error.message || 'Failed to register user.'})
    }
  }

  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const {email, password} = req.body
      if (!email || !password) {
        return res.status(400).json({error: 'Email and password are required.'})
      }
      const {user, token} = await authService.loginUser({email, password})

      return res.status(200).json({
        message: 'Login successful.',
        token,
        user: {firstName: user.firstName, lastName: user.lastName, email: user.email}
      })
    } catch (error: any) {
      return res.status(401).json({error: error.message || 'Invalid credentials.'})
    }
  }

  public async logout(_req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).json({message: 'Logged out successfully.'})
    } catch (error: any) {
      return res.status(500).json({error: error.message || 'Failed to logout.'})
    }
  }

  public async passwordResetRequest(req: Request, res: Response): Promise<Response> {
    try {
      const {email} = req.body
      if (!email) {
        return res.status(400).json({error: 'Email is required.'})
      }
      await authService.requestPasswordReset({email})
      return res.status(200).json({message: 'Password reset link has been sent to your email.'})
    } catch (error: any) {
      return res.status(500).json({error: error.message || 'Failed to process password reset request.'})
    }
  }

  public async passwordResetConfirm(req: Request, res: Response): Promise<Response> {
    try {
      const {token, newPassword} = req.body
      if (!token || !newPassword) {
        return res.status(400).json({error: 'Token and new password are required.'})
      }
      await authService.resetPassword({token, newPassword})
      return res.status(200).json({message: 'Password has been reset successfully.'})
    } catch (error: any) {
      return res.status(500).json({error: error.message || 'Failed to reset password.'})
    }
  }

  public async updateProfile(req: Request, res: Response): Promise<Response> {
    // Assumes request.user is populated by auth middleware with a valid user id.
    const userId = req.user && req.user.id
    const { firstName, lastName } = req.body

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First name and last name are required.' })
    }

    try {
      const updatedUser = await authService.updateUserProfile(userId, { firstName, lastName })
      return res.status(200).json({
        message: 'Profile updated successfully.',
        user: {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email
        }
      })
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to update profile.' })
    }
  }
}

const authController = new AuthController()
export default authController
