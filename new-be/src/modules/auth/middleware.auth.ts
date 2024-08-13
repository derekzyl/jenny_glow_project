/* eslint-disable array-callback-return */
import ROLES from '@modules/admin/Roles/models/model.roles';
import { logger } from '@modules/logger';
import { decryptMe } from '@modules/utils/encrypt';
import { isCircular } from '@modules/utils/remove';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import passport from 'passport';
import ApiError from '../errors/ApiError';

import { allPermissions } from '@modules/setting/roles';
import { IUserDoc } from '../user/interfaces.user';

const verifyCallback =
  (req: Request, resolve: any, reject: any, requiredPermissions: string[]) =>
  async (err: Error, user: IUserDoc, info: string) => {
    if (err || info || !user) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    req.user = user;

    const roless = await ROLES.find();
    const mapRoles: Record<string, string[]> = {};

    roless.map((role) => {
      mapRoles[role.name] = role.permissions;
    });
    const rolePermissions = new Map(Object.entries(mapRoles));
    // logger.info('rolePermissions', rolePermissions);
    // const roles = Object.keys(mapRoles);
    if (requiredPermissions.length) {
      const userRights = rolePermissions && rolePermissions.get(decryptMe(user.role));
      if (!userRights) return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));

      const hasRequiredPermissions = requiredPermissions.every((requiredRight: string) =>
        userRights.includes(requiredRight)
      );
      if (!hasRequiredPermissions && req.params['userId'] !== user.id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      }
    }

    resolve();
  };

const authMiddleware =
  (...requiredPermissions: string[]) =>
  async (req: Request, res: Response, next: NextFunction) =>
    new Promise<void>((resolve, reject) => {

      const newRequiredPermissions = [...requiredPermissions, allPermissions.SuperAdmin, allPermissions.Admin]
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, newRequiredPermissions))(
        req,
        res,
        next
      );
    })
      .then(() => next())
      .catch((err) => {
        if (err && !isCircular(err)) logger.error(JSON.stringify(err));

        return next(err);
      });

export default authMiddleware;
