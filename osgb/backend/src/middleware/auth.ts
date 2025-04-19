import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppDataSource } from '../config/database';

interface TokenPayload {
  id: number;
  username: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
      res.status(401).json({ message: 'Token error' });
      return;
    }
    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
      res.status(401).json({ message: 'Token malformatted' });
      return;
    }
    const secret = process.env.JWT_SECRET || 'osgb_secret_key_change_in_production';
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: 'Invalid token' });
        return;
      }
      req.user = decoded as TokenPayload;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: 'Authentication failed' });
    return;
  }
};

export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    if (roles.includes(req.user.role)) {
      next();
      return;
    }
    res.status(403).json({ message: 'Access denied' });
    return;
  };
};
