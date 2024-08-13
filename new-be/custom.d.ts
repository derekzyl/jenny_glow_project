import { IUserDoc } from '@modules/user/interfaces.user';
import type { IncomingMessage } from 'http';

import 'socket.io';

declare module 'express-serve-static-core' {
  export interface Request {
    user: IUserDoc;
    files: { [fieldname: string]: Multer.File[] } | Multer.File[];
  }
}
interface SessionIncomingMessage extends IncomingMessage {
  session: SessionData;
}
declare module 'socket.io' {
  interface Socket {
    re;
  }
}
