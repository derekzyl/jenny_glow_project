/* eslint-disable import/no-cycle */
import { ApiError } from '../../errors';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { refBonusService, refService, refTransService, userRefsService } from '..';
// everythiing about referrrals
export const createReferral = catchAsync(async (req, res) => {
    const { userId, refBy } = req.body;
    const referral = await refService.createReferral(new Types.ObjectId(userId), refBy);
    res.status(httpStatus.CREATED).send(referral);
});
export const getReferral = catchAsync(async (req, res) => {
    if (typeof req.params['referralId'] === 'string') {
        const referral = await refService.getReferralById(new Types.ObjectId(req.params['referralId']));
        if (!referral) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Referral not found');
        }
        res.send(referral);
    }
});
export const getReferralByUserId = catchAsync(async (req, res) => {
    const referral = await refService.getReferralByUserId(req.user.id);
    if (!referral) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Referral not found');
    }
    res.send(referral);
});
export const updateReferral = catchAsync(async (req, res) => {
    if (typeof req.params['referralId'] === 'string') {
        const referral = await refService.updateReferral(new Types.ObjectId(req.params['referralId']), req.body);
        res.send(referral);
    }
});
export const deleteReferral = catchAsync(async (req, res) => {
    if (typeof req.params['referralId'] === 'string') {
        await refService.deleteReferral(new Types.ObjectId(req.params['referralId']));
        res.status(httpStatus.NO_CONTENT).send();
    }
});
export const getAllReferrals = catchAsync(async (_req, res) => {
    const referrals = await refService.getAllReferrals();
    res.send(referrals);
});
// everything about ref bonus
export const createRefBonus = catchAsync(async (req, res) => {
    const refBonus = await refBonusService.createRefBonus(req.body);
    res.status(httpStatus.CREATED).send(refBonus);
});
export const getRefBonus = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const refBonus = await refBonusService.getRefBonus(new Types.ObjectId(userId), req.query);
    res.status(httpStatus.OK).send(refBonus);
});
export const getAllRefBonus = catchAsync(async (req, res) => {
    const refBonuses = await refBonusService.getAllRefBonus(req.query);
    res.status(httpStatus.OK).send(refBonuses);
});
export const deleteRefBonusById = catchAsync(async (req, res) => {
    const { refId } = req.params;
    await refBonusService.deleteRefBonusById(new Types.ObjectId(refId));
    res.status(httpStatus.NO_CONTENT).send();
});
export const getRefBonusById = catchAsync(async (req, res) => {
    const { refId } = req.params;
    const refBonus = await refBonusService.getRefBonusById(new Types.ObjectId(refId));
    res.status(httpStatus.OK).send(refBonus);
});
// everything about ref bonus
export const createRefTransaction = catchAsync(async (req, res) => {
    const refTransaction = await refTransService.createRefTransation(req.body);
    res.status(httpStatus.CREATED).send(refTransaction);
});
export const getRefTransaction = catchAsync(async (req, res) => {
    const { id } = req.user;
    const refTransaction = await refTransService.getRefTransation(new Types.ObjectId(id), req.query);
    res.status(httpStatus.OK).send(refTransaction);
});
export const getAllRefTransactions = catchAsync(async (req, res) => {
    const refTransactions = await refTransService.getAllRefTransation(req.query);
    res.status(httpStatus.OK).send(refTransactions);
});
export const deleteRefTransactionById = catchAsync(async (req, res) => {
    const { refId } = req.params;
    await refTransService.deleteRefTransationById(new Types.ObjectId(refId));
    res.status(httpStatus.NO_CONTENT).send();
});
export const getRefTransactionById = catchAsync(async (req, res) => {
    const { refId } = req.params;
    const refTransaction = await refTransService.getRefTransationById(new Types.ObjectId(refId));
    res.status(httpStatus.OK).send(refTransaction);
});
// every thing about user refs
export const addToUserRefs = catchAsync(async (req, res) => {
    const { userId, ref } = req.body;
    const userRef = await userRefsService.addToUserRefs(new Types.ObjectId(userId), new Types.ObjectId(ref));
    res.status(httpStatus.CREATED).send(userRef);
});
export const updateUserRefTotalAmount = catchAsync(async (req, res) => {
    await userRefsService.updateUserRefTotalAmount(req.body);
    res.status(httpStatus.NO_CONTENT).send();
});
export const getUserRefs = catchAsync(async (req, res) => {
    const { id } = req.user;
    const userRefs = await userRefsService.getUserRefs(new Types.ObjectId(id), req.query);
    res.status(httpStatus.OK).send(userRefs);
});
export const getAllUserRefs = catchAsync(async (req, res) => {
    const userRefs = await userRefsService.getAllUserRefs(req.query);
    res.status(httpStatus.OK).send(userRefs);
});
export const deleteUserRefById = catchAsync(async (req, res) => {
    const { refId } = req.params;
    await userRefsService.deleteUserRefById(new Types.ObjectId(refId));
    res.status(httpStatus.NO_CONTENT).send();
});
export const getUserRefById = catchAsync(async (req, res) => {
    const { refId } = req.params;
    const userRef = await userRefsService.getUserRefById(new Types.ObjectId(refId));
    res.status(httpStatus.OK).send(userRef);
});
//# sourceMappingURL=controller.referral.js.map