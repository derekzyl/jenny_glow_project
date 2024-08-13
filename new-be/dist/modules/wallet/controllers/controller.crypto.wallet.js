/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { fiatWalletService } from '..';
import ApiError from '../../errors/ApiError';
import { pick } from '../../utils';
import catchAsync from '../../utils/catchAsync';
import * as walletService from '../services/service.crypto.wallet';
/*
  Currency Wallets
*/
export const createNewWallet = catchAsync(async (req, res) => {
    const wallet = await walletService.createCryptoWallet(Object.assign(Object.assign({}, req.body), { userId: req.user.id }));
    res.status(httpStatus.CREATED).send(wallet);
});
export const getCryptoWallets = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['currencyCode', 'address', 'userId']);
    const options = pick(req.query, ['sort', 'limit', 'page', 'projectBy']);
    const wallet = await walletService.queryCryptoWallets(filter, options);
    if (!wallet) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
    }
    res.send(wallet);
});
export const withdrawCrypto = catchAsync(async (req, res) => {
    const wallet = await walletService.withdrawCrypto(Object.assign(Object.assign({}, req.body), { userId: req.user.id }));
    res.status(httpStatus.CREATED).send(wallet);
});
export const getMainAccount = catchAsync(async (_req, res) => {
    const account = await walletService.getMainAccount();
    res.send(account);
});
export const getCryptoWalletsByUserId = catchAsync(async (req, res) => {
    const wallets = await walletService.getCryptoWalletsByUserId(new mongoose.Types.ObjectId(req.user.id));
    res.send(wallets);
});
export const updateCryptoWalletById = catchAsync(async (req, res) => {
    if (!req.params['walletId']) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Wallet id is required');
    }
    if (!req.params['currencyCode']) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Currency code is required');
    }
    if (!req.body) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Wallet body is required');
    }
    const wallet = await walletService.updateCryptoWalletById(new mongoose.Types.ObjectId(req.params['walletId']), req.params['currencyCode'], req.body);
    res.send(wallet);
});
export const deleteCryptoWalletById = catchAsync(async (req, res) => {
    const wallet = await walletService.deleteCryptoWalletById(new mongoose.Types.ObjectId(req.params['walletId']));
    res.send(wallet);
});
export const getWalletByWalletAddress = catchAsync(async (req, res) => {
    if (!req.params['address']) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Wallet address is required');
    }
    const wallet = await walletService.getWalletByWalletAddress(req.params['address']);
    res.send(wallet);
});
export const getUserWalletById = catchAsync(async (req, res) => {
    if (!req.params['walletId']) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Wallet id is required');
    }
    const wallet = await walletService.getUserWalletById(new mongoose.Types.ObjectId(req.params['walletId']));
    res.send(wallet);
});
export const getAllUserWallets = catchAsync(async (req, res) => {
    const wallet = await walletService.getCryptoWalletsByUserId(new mongoose.Types.ObjectId(req.user.id));
    const fiat = await fiatWalletService.getFiatWalletsByUserId(new mongoose.Types.ObjectId(req.user.id));
    const resd = {
        results: wallet.results.concat(fiat.results),
        totalResults: wallet.totalResults + fiat.totalResults,
        page: wallet.page,
        limit: wallet.limit,
        totalPages: wallet.totalPages,
    };
    res.send(resd);
});
export const getCryptoCumulativeBalance = catchAsync(async (req, res) => {
    const wallet = await walletService.getCryptoWalletCumulativeBalanceByUserId(new mongoose.Types.ObjectId(req.user.id));
    res.send({ balanceInUsd: wallet });
});
//# sourceMappingURL=controller.crypto.wallet.js.map