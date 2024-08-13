/* eslint-disable import/no-cycle */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../errors/ApiError';
import catchAsync from '../../utils/catchAsync';
import pick from '../../utils/pick';
import * as walletCurrencyService from '../services/service.currency.wallet';
/*
  CURRENCIES
*/
export const addCurrency = catchAsync(async (req, res) => {
    const { user } = req;
    const { assetType } = req.body;
    const { label } = req.body;
    const currency = await walletCurrencyService.addCryptoAssets(assetType, label, user.id);
    res.status(httpStatus.CREATED).send(currency);
});
export const getAllCurrencies = catchAsync(async (req, res) => {
    const filter = pick(req.query, [
        'name',
        'currencyType',
        'pricePctDiffrence',
        'minDeposit',
        'minWithdraw',
        'maxWithdraw',
        'feeType',
        'depositFee',
        'withdrawFee',
        'isActive',
    ]);
    // todo await walletCurrencyService.getAllTradableAssets();
    const options = pick(req.query, ['sort', 'limit', 'page']);
    const result = await walletCurrencyService.queryCurrencies(filter, options);
    res.send(result);
});
export const getCurrency = catchAsync(async (req, res) => {
    if (typeof req.params['currencyId'] === 'string') {
        const currency = await walletCurrencyService.getCurrencyById(new mongoose.Types.ObjectId(req.params['currencyId']));
        if (!currency) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Currency not found');
        }
        res.send(currency);
    }
});
export const updateCurrency = catchAsync(async (req, res) => {
    if (typeof req.params['currencyId'] === 'string') {
        const { user } = req;
        const currency = await walletCurrencyService.updateCurrencyById(new mongoose.Types.ObjectId(req.params['currencyId']), Object.assign({ updatedByUserId: user.id }, req.body));
        res.send(currency);
    }
});
export const deleteCurrency = catchAsync(async (req, res) => {
    if (typeof req.params['currencyId'] === 'string') {
        await walletCurrencyService.deleteCurrencyById(new mongoose.Types.ObjectId(req.params['currencyId']));
        res.status(httpStatus.NO_CONTENT).send();
    }
});
export const deactivateCurrency = catchAsync(async (req, res) => {
    if (typeof req.params['currencyId'] === 'string') {
        const { user } = req;
        await walletCurrencyService.deactivateCurrencyById(new mongoose.Types.ObjectId(req.params['currencyId']), user.id);
        res.status(httpStatus.NO_CONTENT).send();
    }
});
// Controller for getting all tradable assets
export const getAllTradableAssets = catchAsync(async (_req, res) => {
    const tradableAssets = await walletCurrencyService.getAllTradableAssets();
    res.status(httpStatus.OK).json(tradableAssets);
});
// Controller for adding crypto assets
export const addCryptoAssets = catchAsync(async (req, res) => {
    const { assetType, label } = req.body;
    const userId = req.user.id; // Assuming user ID is available in the request
    const newAsset = await walletCurrencyService.addCryptoAssets(assetType, label, userId);
    res.status(httpStatus.CREATED).json(newAsset);
});
export const getAllTradableAssetsWithIcons = catchAsync(async (_req, res) => {
    const tradableAssets = await walletCurrencyService.tradableAssetsPlusIcons();
    res.status(httpStatus.OK).json(tradableAssets);
});
export const updateDbTradeableAssets = catchAsync(async (_req, res) => {
    await walletCurrencyService.updateDbTradableAssets();
    res.status(httpStatus.OK).json({ message: 'Database updated with tradable assets successfully.' });
});
export const getAllTradableAssetsTypes = catchAsync(async (_req, res) => {
    const tradableAssetsTypes = await walletCurrencyService.getAllTradableAssetsTypes();
    res.status(httpStatus.OK).json(tradableAssetsTypes);
});
export const getAssetByType = catchAsync(async (req, res) => {
    const { assetType } = req.params;
    if (assetType) {
        const asset = await walletCurrencyService.getAssetByType(assetType);
        res.status(httpStatus.OK).json(asset);
    }
});
export const queryUserCurrencies = catchAsync(async (req, res) => {
    const asset = await walletCurrencyService.queryUserCurrencies(req.user.id);
    res.status(httpStatus.OK).json(asset);
});
//# sourceMappingURL=controller.currency.wallet.js.map