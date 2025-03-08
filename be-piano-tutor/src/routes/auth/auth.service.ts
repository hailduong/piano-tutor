import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import prisma from '@src/config/prisma';
import { sendEmail } from '@src/utils/email';

export interface IRegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface IProfileUpdate {
  firstName: string;
  lastName: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IResetRequestData {
  email: string;
}

export interface IResetPasswordData {
  token: string;
  newPassword: string;
}

class AuthService {
  constructor(private db = prisma) {} // Dependency injection

  // Generates a JWT token for an authenticated user.
  private generateToken(user: { id: number; email: string }): string {
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.APP_SECRET as string,
      { expiresIn: '1h' }
    );
    return token;
  }

  // Registers a new user in the database.
  public async registerUser({ email, password, firstName, lastName }: IRegisterData) {
    const existingUser = await this.db.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.db.user.create({
      data: { email, password: hashedPassword, firstName, lastName },
    });
    return user;
  }

  // Verifies user credentials and generates JWT upon successful authentication.
  public async loginUser({ email, password }: ILoginData) {
    const user = await this.db.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }
    const token = this.generateToken({ id: user.id, email: user.email });
    return { user, token };
  }

  public async updateUserProfile(userId: number, data: IProfileUpdate) {
    // Check that the user exists.
    const user = await this.db.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new Error('User not found')
    }

    // Update the user's first and last name.
    const updatedUser = await this.db.user.update({
      where: { id: userId },
      data: { firstName: data.firstName, lastName: data.lastName },
    })
    return updatedUser
  }

  // Handles password reset request by generating and sending a reset token.
  public async requestPasswordReset({ email }: IResetRequestData) {
    const user = await this.db.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    const token = crypto.randomBytes(20).toString('hex');
    const expiry = new Date(Date.now() + 3600000);
    await this.db.user.update({
      where: { email },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });
    const resetLink = `${process.env.APP_URL}/auth/password-reset?token=${token}`;
    const emailOptions = {
      to: email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };
    await sendEmail(emailOptions);
    return { message: 'Password reset email sent' };
  }

  // Resets the user's password if the reset token is valid and not expired.
  public async resetPassword({ token, newPassword }: IResetPasswordData) {
    const user = await this.db.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });
    if (!user) {
      throw new Error('Invalid or expired token');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await this.db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    return updatedUser;
  }
}

const authService = new AuthService();
export default authService;
