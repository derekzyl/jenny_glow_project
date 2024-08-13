/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { auth } from '../../auth';
import { ChatSocket } from '../../chat/websocket.chat';
import { logger } from '../../logger';
import { Server as SocketServer } from 'socket.io';
import { isCircular } from '../remove';
export class Socket {
    constructor(httpServer) {
        this.connectionStatus = false;
        this.io = new SocketServer(httpServer, {
            cors: {
                origin: ['http://localhost:5173', 'http://192.168.0.100:5173', 'http://172.25.48.1:5173'],
                allowedHeaders: ['Authorization', 'authorization'],
                methods: ['GET', 'POST'],
                credentials: true,
            },
        });
        this.io.engine.use(auth());
        // this.io.engine.use((req: any, _res: any, next: any) => {
        //   if (!isCircular(req.headers)) logger.info(JSON.stringify(req.headers));
        //   if (!isCircular(req)) logger.info(JSON.stringify(req));
        //   next();
        // });
        // logger.info(`${JSON.stringify()}`);
        this.io.on('connection', (socket) => {
            var _a;
            this.connectionStatus = true;
            logger.info(`a user connected: ${socket.id}`);
            this.user = socket.request.user;
            if (this.user) {
                // eslint-disable-next-line no-new
                new ChatSocket(socket, this.user);
            }
            logger.info((_a = this.user) === null || _a === void 0 ? void 0 : _a.firstName);
        });
        this.io.on('disconnected', (socket) => {
            this.connectionStatus = false;
            logger.info(`a user connected: ${socket.id}`);
        });
        this.io.engine.on('connection_error', (err) => {
            logger.info('socket.io error');
            if (err.req && !isCircular(err.req)) {
                logger.info(`Request object: ${JSON.stringify(err.req)}`);
            }
            // Check if `err.context` is present and stringify it if it's not a circular structure
            if (err.context && !isCircular(err.context)) {
                logger.info(`Additional context: ${JSON.stringify(err.context)}`);
            }
            logger.info(err.code); // the error code, for example 1
            logger.info(err.message); // the error message, for example "Session ID unknown"
        });
    }
    emit({ eventName, payload }) {
        logger.info(`emitter event ${eventName}`);
        this.io.emit(eventName, payload);
    }
    middleware() {
        this.io.use((io, next) => {
            const { token } = io.handshake.auth;
            if (!token) {
                return next(new Error('Authentication error'));
            }
            next();
        });
    }
    addEvent({ callback, eventName }) {
        logger.info(`added event ${eventName}`);
        this.io.on(eventName, callback);
    }
    removeEvent({ callback, eventName }) {
        this.io.off(eventName, callback);
    }
}
// eslint-disable-next-line import/prefer-default-export
//# sourceMappingURL=index.js.map