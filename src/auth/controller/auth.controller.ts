import { NextFunction, Request, Response } from 'express';
import { Post } from '../../posts/models/post.model';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { LoginDto } from '../dto/login.dto';
import {  compare } from 'bcrypt';
import { User } from '../../users/models/user.model';
import passport from 'passport';

export const login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', { session: false }, (err:Error, user:any, info:any) => {
      if (err || !user) {
        return res.status(400).json({ message: info?.message || 'Login failed', user });
      }
  
      // Include the user role in the JWT payload
      const token = jwt.sign(
        { id: user.id, role: user.role },  // Include the role in the token
        process.env.JWT_SECRET || 'your_jwt_secret', 
        { expiresIn: '1h' }
      );
  
      return res.status(200).json({ message: 'Logged in successfully', token });
    })(req, res, next);
  };