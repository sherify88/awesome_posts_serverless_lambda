import { Request, Response, NextFunction } from 'express';

export const validateRules = (rules: { [key: string]: { required: boolean, type: string } }) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: { [key: string]: string } = {};
    const source = Object.keys(req.body).length > 0 ? req.body : Object.keys(req.query).length > 0 ? req.query : req.params;

    for (const [field, rule] of Object.entries(rules)) {
      const value = source[field];

      if (rule.required && (value === undefined || value === null)) {
        errors[field] = `${field} is required.`;
      } else if (value !== undefined) {
        if (rule.type === 'string' && typeof value !== 'string') {
          errors[field] = `${field} must be a string.`;
        } else if (rule.type === 'number' && typeof value !== 'number') {
          errors[field] = `${field} must be a number.`;
        } else if (rule.type === 'email' && typeof value === 'string' && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
          errors[field] = `${field} must be a valid email address.`;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json({ message: 'Validation failed', errors });
      return;
    }

    next();
  };
};
