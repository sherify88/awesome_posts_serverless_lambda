import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (createError.isHttpError(err)) {
    res.status(err.status || 500).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error: err.message,  
    });
  }
};
