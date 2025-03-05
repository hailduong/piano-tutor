import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/*
  Middleware for protecting routes.
  This middleware verifies the JWT from the Authorization header.
*/
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // Retrieve the token from the Authorization header formatted as: Bearer <token>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.APP_SECRET as string);
    // Optionally attach the decoded user information to the request for downstream use
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};
