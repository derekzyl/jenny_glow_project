/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { auth } from '@modules/auth';
import { ChatSocket } from '@modules/chat/websocket.chat';
import { logger } from '@modules/logger';
import { IUserDoc } from '@modules/user/interfaces.user';
import { IncomingMessage, Server, ServerResponse } from 'node:http';
import { Server as SocketServer } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { isCircular } from '../remove';

export class Socket {
  public io: SocketServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

  public connectionStatus: boolean = false;

  public user: IUserDoc | undefined;

  constructor(httpServer: Server<typeof IncomingMessage, typeof ServerResponse>) {
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
      this.connectionStatus = true;
      logger.info(`a user connected: ${socket.id}`);
      this.user = (socket.request as any).user;
      if (this.user) {
        // eslint-disable-next-line no-new
        new ChatSocket(socket, this.user);
      }
      logger.info(this.user?.firstName);
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

  emit<T>({ eventName, payload }: { eventName: string; payload: T }) {
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

  addEvent<T>({ callback, eventName }: { eventName: string; callback: (data: T) => void }) {
    logger.info(`added event ${eventName}`);
    this.io.on(eventName, callback);
  }

  removeEvent<T>({ callback, eventName }: { eventName: string; callback: (data: T) => void }) {
    this.io.off(eventName, callback);
  }
}

// eslint-disable-next-line import/prefer-default-export
