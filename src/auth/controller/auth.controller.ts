import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

export const login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', { session: false }, (err:Error, user:any, info:any) => {
      if (err || !user) {
        return res.status(400).json({ message: info?.message || 'Login failed', user });
      }
  
      const token = jwt.sign(
        { id: user.id, role: user.role },  
        process.env.JWT_SECRET || 'your_jwt_secret', 
        { expiresIn: '720h' }
      );
  
      return res.status(200).json({ message: 'Logged in successfully', token });
    })(req, res, next);
  };