import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../errors/ApiError';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick';
import * as walletService from '../services/service.giftcard.wallet';
/*
  GIFTCARDS
*/
export const addGiftcard = catchAsync(async (req, res) => {
    const { user } = req;
    const card = await walletService.addNewGiftcard(Object.assign({ createdByUserId: user.id, updatedByUserId: user.id }, req.body));
    res.status(httpStatus.CREATED).send(card);
});
export const getAllGiftcards = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['merchant', 'name', 'recipient', 'amount', 'currencyId', 'pricePctDiffrence', 'isActive']);
    const options = pick(req.query, ['sort', 'limit', 'page', 'projectBy']);
    const result = await walletService.queryGiftcards(filter, options);
    res.send(result);
});
export const getGiftcard = catchAsync(async (req, res) => {
    if (typeof req.params['giftcardId'] === 'string') {
        const card = await walletService.getGiftcardById(new mongoose.Types.ObjectId(req.params['giftcardId']));
        if (!card) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Card not found');
        }
        res.send(card);
    }
});
export const getGiftcardsByMerchantId = catchAsync(async (req, res) => {
    if (typeof req.params['merchantId'] === 'string') {
        const card = await walletService.queryGiftcardsByMerchant(new mongoose.Types.ObjectId(req.params['merchantId']));
        if (!card) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Card not found');
        }
        res.send(card);
    }
});
export const updateGiftcard = catchAsync(async (req, res) => {
    if (typeof req.params['giftcardId'] === 'string') {
        const { user } = req;
        const card = await walletService.updateGiftcardById(new mongoose.Types.ObjectId(req.params['giftcardId']), Object.assign({ updatedByUserId: user.id }, req.body));
        res.send(card);
    }
});
export const deleteGiftcard = catchAsync(async (req, res) => {
    if (typeof req.params['giftcardId'] === 'string') {
        await walletService.deleteGiftcardById(new mongoose.Types.ObjectId(req.params['giftcardId']));
        res.status(httpStatus.NO_CONTENT).send();
    }
});
export const deactivateGiftcard = catchAsync(async (req, res) => {
    if (typeof req.params['giftcardId'] === 'string') {
        const { user } = req;
        await walletService.deactivateGiftcardById(new mongoose.Types.ObjectId(req.params['giftcardId']), user.id);
        res.status(httpStatus.NO_CONTENT).send();
    }
});
//# sourceMappingURL=controller.giftcard.wallet.js.map