import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export const validateDto = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Transform the request body into the DTO class instance
    const dtoObject = plainToClass(dtoClass, req.body);

    // Validate the transformed object
    const errors = await validate(dtoObject, { whitelist: true, forbidNonWhitelisted: true });

    if (errors.length > 0) {
      // If validation errors exist, send a response and end the function
      res.status(400).json({
        message: 'Validation failed',
        errors: errors.map(error => ({
          property: error.property,
          constraints: error.constraints,
        })),
      });
      return; // Explicitly return to prevent further execution
    }

    // Call next if validation passed
    next();
  };
};
