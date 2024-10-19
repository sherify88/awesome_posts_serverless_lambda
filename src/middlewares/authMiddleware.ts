import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

// JWT authentication middleware
export const jwtAuth = passport.authenticate('jwt', { session: false });

// Authorization middleware to check roles
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;  // `req.user` should be set after `jwtAuth`

    if (!user) {
      res.status(401).json({ message: 'Unauthorized: No user found' });
      return;
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
      return;
    }

    next();  // Proceed if the user has the required role
  };
};
