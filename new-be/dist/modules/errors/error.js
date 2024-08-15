/* eslint-disable @typescript-eslint/no-unused-vars */
import { logger } from '../logger';
import axios from 'axios';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import config from '../../config/config';
import ApiError from './ApiError';
// Error conversion middleware
export const errorConverter = (err, _req, _res, next) => {
    var _a, _b, _c;
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
            statusCode = ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) || httpStatus.INTERNAL_SERVER_ERROR;
            message = ((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error.message || 'Axios Error';
        }
        if (error.isJoi) {
            statusCode = httpStatus.BAD_REQUEST;
            message = error.details.map((detail) => detail.message).join(', ');
        }
        error = new ApiError(statusCode, message, false, error.stack);
    }
    next(error);
};
// Error handling middleware
export const errorHandler = (err, _req, res, _next) => {
    let { statusCode, message } = err;
    if (config.env === 'production' && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = 'Internal Server Error';
    }
    res.locals['errorMessage'] = err.message;
    const response = Object.assign({ code: statusCode, message }, (config.env === 'development' && { stack: err.stack }));
    if (config.env === 'development') {
        logger.error(err);
    }
    res.status(statusCode).send(response);
};
//# sourceMappingURL=error.js.map