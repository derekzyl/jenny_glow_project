import { jwtStrategy } from './modules/auth';
import { ApiError, errorConverter, errorHandler } from './modules/errors';
import { morgan } from './modules/logger';
import { authLimiter } from './modules/utils';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import httpStatus from 'http-status';
import passport from 'passport';
import xss from 'xss-clean';
import config from './config/config';
import routesV1 from './routes/v1';
const app = express();
/* The `if (config.env !== 'test') {` statement is checking if the environment variable `env` is not
equal to `'test'`. If the condition is true, it means that the code is not running in a test
environment, so it proceeds to execute the code block inside the if statement. This code block
includes setting up the `morgan` logger middleware for logging success and error messages. */
if (config.env !== 'test') {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
}
// set security HTTP headers
app.use(helmet());
// enable cors
app.use(cors());
app.options('*', cors());
// parse json request body
app.use(express.json());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
// sanitize request data
app.use(xss());
app.use(ExpressMongoSanitize());
// gzip compression
app.use(compression());
// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);
// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
    app.use('/api/v1/auth', authLimiter);
}
// v1 api routes
app.use('/api/v1', routesV1);
// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});
// convert error to ApiError, if needed
app.use(errorConverter);
// handle error
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map