/* eslint-disable array-callback-return */
import ROLES from '../admin/Roles/models/model.roles';
import { logger } from '../logger';
import { decryptMe } from '../utils/encrypt';
import { isCircular } from '../utils/remove';
import httpStatus from 'http-status';
import passport from 'passport';
import ApiError from '../errors/ApiError';
import { allPermissions } from '../setting/roles';
const verifyCallback = (req, resolve, reject, requiredPermissions) => async (err, user, info) => {
    if (err || info || !user) {
        return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    req.user = user;
    const roless = await ROLES.find();
    const mapRoles = {};
    roless.map((role) => {
        mapRoles[role.name] = role.permissions;
    });
    const rolePermissions = new Map(Object.entries(mapRoles));
    // logger.info('rolePermissions', rolePermissions);
    // const roles = Object.keys(mapRoles);
    if (requiredPermissions.length) {
        const userRights = rolePermissions && rolePermissions.get(decryptMe(user.role));
        if (!userRights)
            return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
        const hasRequiredPermissions = requiredPermissions.every((requiredRight) => userRights.includes(requiredRight));
        if (!hasRequiredPermissions && req.params['userId'] !== user.id) {
            return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
        }
    }
    resolve();
};
const authMiddleware = (...requiredPermissions) => async (req, res, next) => new Promise((resolve, reject) => {
    const newRequiredPermissions = [...requiredPermissions, allPermissions.SuperAdmin, allPermissions.Admin];
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, newRequiredPermissions))(req, res, next);
})
    .then(() => next())
    .catch((err) => {
    if (err && !isCircular(err))
        logger.error(JSON.stringify(err));
    return next(err);
});
export default authMiddleware;
//# sourceMappingURL=middleware.auth.js.map