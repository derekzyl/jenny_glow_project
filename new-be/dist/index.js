/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import logger from './modules/logger/logger';
import mongoose from 'mongoose';
import { Socket } from './modules/utils/socket';
import { createAdapter } from '@socket.io/cluster-adapter';
import { setupWorker } from '@socket.io/sticky';
import { createServer } from 'node:http';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import app from './app';
import config from './config/config';
// eslint-disable-next-line import/prefer-default-export
const serve = createServer(app);
export const baseSocket = new Socket(serve);
dirname(fileURLToPath(import.meta.url));
// import { addNewWorkerJob } from './modules/worker/service.jobs.worker';
// import QueueManager from './modules/worker/manager.jobs.worker';
// import { JobTypes } from './config/jobs';
// import { createNewWallet } from '@modules/blockchain/core.wallet.blockchain';
// import { IBlockchainWallet } from '@modules/blockchain/interface.blockchain';
// import XrpClient from '@modules/blockchain/rpc/xrp.rpc.blockchain';
let server;
/* The code block is an arrow function that is executed after successfully connecting to MongoDB. It
performs the following tasks: */
baseSocket.io.adapter(createAdapter());
setupWorker(baseSocket.io);
mongoose
    .connect(config.mongoose.url, {
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
})
    .then((data) => {
    logger.info('Connected to MongoDB: ');
    /* The code block `() => { logger.info(`Listening to port ${config.port}`); }` is an arrow function
  that is executed after the server successfully starts listening to a specified port. It logs a
  message indicating that the server is listening to the specified port. */
    if (data.connection.readyState === 1)
        serve.listen(config.port, () => {
            logger.info(`Listening to port ${config.port}`);
        });
})
    .catch((error) => {
    logger.error(error);
    process.exit(1);
});
/**
 * The exitHandler function closes the server and exits the process.
 */
const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
};
/**
 * The function `unexpectedErrorHandler` logs an error message using a logger and then calls the
 * `exitHandler` function.
 * @param {string} error - The `error` parameter is a string that represents the error message or
 * description.
 */
const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
};
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
/* The code block `() => { logger.info('SIGTERM received'); if (server) { server.close(); } }` is an
arrow function that is executed when a SIGTERM signal is received. */
process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});
//# sourceMappingURL=index.js.map