/* eslint-disable @typescript-eslint/no-unused-vars */
import { logger } from '@modules/logger';
import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import config from '../../config/config';
import ApiError from './ApiError';

// Error conversion middleware
export const errorConverter = (err: any, _req: Request, _res: Response, next: NextFunction) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    let message = error.message || `${statusCode}`;

    // Check for Mongoose errors
    if (error instanceof mongoose.Error) {
      statusCode = httpStatus.BAD_REQUEST;
      message = error.message;
    }

    // Check for Axios errors
    if (axios.isAxiosError(error)) {
      statusCode = error.response?.status || httpStatus.INTERNAL_SERVER_ERROR;
      message = error.response?.data?.message || error.message || 'Axios Error';
    }
    if (error.isJoi) {
      statusCode = httpStatus.BAD_REQUEST;
      message = error.details.map((detail: any) => detail.message).join(', ');
    }

    error = new ApiError(statusCode, message, false, error.stack);
  }

  next(error);
};

// Error handling middleware
export const errorHandler = (err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = 'Internal Server Error';
  }

  res.locals['errorMessage'] = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};
