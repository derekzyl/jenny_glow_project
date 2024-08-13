import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../errors/ApiError';
import { pick } from '../utils';
import catchAsync from '../utils/catchAsync';
import * as kycService from './service.kyc';
export const createKycUserProfile = catchAsync(async (req, res) => {
    const kycUserProfile = await kycService.createKycUser(Object.assign({ userId: req.user.id, createdByUserId: req.user.id, updatedByUserId: req.user.id }, req.body));
    res.status(httpStatus.CREATED).send(kycUserProfile);
});
// admin access only
export const getKycUsers = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['country', 'tier', 'userId']);
    const options = pick(req.query, ['sort', 'limit', 'page', 'projectBy']);
    const result = await kycService.queryKycUsers(filter, options);
    res.send(result);
});
// admin access only
export const getKycUserById = catchAsync(async (req, res) => {
    if (typeof req.params['kycId'] === 'string' || typeof req.params['userId'] === 'string') {
        const user = (await kycService.getKycUserById(new mongoose.Types.ObjectId(req.params['kycId']))) ||
            (await kycService.getKycUserByUserId(new mongoose.Types.ObjectId(req.params['userId'])));
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User kyc profile not found');
        }
        res.send(user);
    }
});
// users only
export const getKycUserProfile = catchAsync(async (req, res) => {
    const kycUserProfile = await kycService.getKycUserByUserId(new mongoose.Types.ObjectId(req.user.id));
    if (!kycUserProfile) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User kyc Profile not found');
    }
    res.send(kycUserProfile);
});
// users only
export const updateKycUserProfile = catchAsync(async (req, res) => {
    const kycUserProfile = await kycService.updateKycProfileById(new mongoose.Types.ObjectId(req.user.id), req.body, req.user.id);
    res.send(kycUserProfile);
});
// users only
export const deleteKycUser = catchAsync(async (req, res) => {
    if (typeof req.params['userId'] === 'string') {
        await kycService.deleteKycProfileByUserId(new mongoose.Types.ObjectId(req.params['userId']));
        res.status(httpStatus.NO_CONTENT).send();
    }
});
export const getKycUserStatus = catchAsync(async (req, res) => {
    const getKycStatus = await kycService.getKycStatus(new mongoose.Types.ObjectId(req.user.id));
    res.send(getKycStatus);
});
// admin access only
export const updateKycUserVerificationStatus = catchAsync(async (req, res) => {
    const user = await kycService.VerifyKycProfileById(new mongoose.Types.ObjectId(req.params['kycId']), req.body, req.user.id);
    res.send(user);
});
export const getKycUserStatusById = catchAsync(async (req, res) => {
    const kycId = new mongoose.Types.ObjectId(req.params['kycId']);
    const getKycStatus = await kycService.getKycUserStatusByKycId(kycId);
    res.send(getKycStatus);
});
export const getKycUserIfExist = catchAsync(async (req, res) => {
    const { user } = req;
    const getKycStatus = await kycService.checkIfKycExist(user.id);
    res.send({ kycStatus: getKycStatus });
});
//# sourceMappingURL=controller.kyc.js.map