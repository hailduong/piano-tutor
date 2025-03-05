import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import prisma from '@src/config/prisma';
import { sendEmail } from '@src/utils/email';

export interface IRegisterData {
  email: string;
  password: string;
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

export class AuthService {
  /* Generates a JWT token for an authenticated user.
     Props & Store: Accepts a user id and email from the database.
     Returns: A signed JWT token.
  */
  static generateToken(user: { id: number; email: string }): string {
    // Use APP_SECRET from environment variables to sign the token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.APP_SECRET as string,
      { expiresIn: '1h' } // Token expires in 1 hour
    );
    return token;
  }

  /* Registers a new user using Prisma. */
  static async registerUser({ email, password }: IRegisterData) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    return user;
  }

  /* Logs in a user by validating credentials and generating a JWT. */
  static async loginUser({ email, password }: ILoginData) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }
    // Generate and return a JWT token upon successful authentication
    const token = this.generateToken({ id: user.id, email: user.email });
    return { user, token };
  }

  /* Initiates a password reset request by generating a reset token, storing it, and sending an email. */
  static async requestPasswordReset({ email }: IResetRequestData) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    const token = crypto.randomBytes(20).toString('hex');
    const expiry = new Date(Date.now() + 3600000);
    await prisma.user.update({
      where: { email },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });
    const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;
    const emailOptions = {
      to: email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };
    await sendEmail(emailOptions);
    return { message: 'Password reset email sent' };
  }

  /* Resets the user's password by verifying the token and updating the password. */
  static async resetPassword({ token, newPassword }: IResetPasswordData) {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });
    if (!user) {
      throw new Error('Invalid or expired token');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await prisma.user.update({
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
