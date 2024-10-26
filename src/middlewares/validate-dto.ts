import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export const validateDto = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // define source from non empty object lenght body or query or params
    const source = Object.keys(req.body).length > 0 ? req.body : Object.keys(req.query).length > 0 ? req.query : req.params;
    const dtoObject = plainToClass(dtoClass, source);
    console.log({ dtoObject,source,params:req.params,query:req.query,body:req.body });
    

    // Validate the transformed object
    const errors = await validate(dtoObject, { whitelist: true, forbidNonWhitelisted: true });
    console.log({ errors });

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
