// giftCardMerchant.controller.ts
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { giftCardMerchantService } from '..';
import { catchAsync } from '../../utils';
import pick from '../../utils/pick';
export const addGiftCardMerchant = catchAsync(async (req, res) => {
    const giftCardMerchantBody = req.body;
    const createdByUserId = new mongoose.Types.ObjectId(req.user.id);
    const updatedByUserId = new mongoose.Types.ObjectId(req.user.id);
    const newGiftCardMerchant = await giftCardMerchantService.addNewGiftCardMerchant(Object.assign({ createdByUserId,
        updatedByUserId }, giftCardMerchantBody));
    res.status(httpStatus.CREATED).json(newGiftCardMerchant);
});
export const getAllGiftCardMerchants = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'merchant', 'active']);
    const options = pick(req.query, ['sort', 'limit', 'page']);
    const result = await giftCardMerchantService.queryGiftCardMerchants(filter, options);
    res.status(httpStatus.OK).json(result);
});
export const getGiftCardMerchant = catchAsync(async (req, res) => {
    const giftCardMerchantId = new mongoose.Types.ObjectId(req.params['giftCardMerchantId']);
    const giftCardMerchant = await giftCardMerchantService.getGiftCardMerchantById(giftCardMerchantId);
    res.status(httpStatus.OK).json(giftCardMerchant);
});
export const updateGiftCardMerchant = catchAsync(async (req, res) => {
    const giftCardMerchantId = new mongoose.Types.ObjectId(req.params['giftCardMerchantId']);
    const updateBody = req.body;
    const updatedGiftCardMerchant = await giftCardMerchantService.updateGiftCardMerchantById(giftCardMerchantId, updateBody);
    res.status(httpStatus.OK).json(updatedGiftCardMerchant);
});
export const deleteGiftCardMerchant = catchAsync(async (req, res) => {
    const giftCardMerchantId = new mongoose.Types.ObjectId(req.params['giftCardMerchantId']);
    await giftCardMerchantService.deleteGiftCardMerchantById(giftCardMerchantId);
    res.status(httpStatus.NO_CONTENT).send();
});
export const deactivateGiftCardMerchant = catchAsync(async (req, res) => {
    const giftCardMerchantId = new mongoose.Types.ObjectId(req.params['giftCardMerchantId']);
    await giftCardMerchantService.deactivateGiftCardMerchantById(giftCardMerchantId, req.user.id);
    res.status(httpStatus.NO_CONTENT).send();
});
//# sourceMappingURL=controller.giftcard.merchant.js.map