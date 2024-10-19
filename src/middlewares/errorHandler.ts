import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

// Global error handler
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Check if the error is an HTTP error
  if (createError.isHttpError(err)) {
    res.status(err.status || 500).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // For other errors, default to 500
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error: err.message,  // Optional for debugging
    });
  }
};
