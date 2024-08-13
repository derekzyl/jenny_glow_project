import { ApiError } from '@modules/errors';
import { IOptions } from '@modules/paginate/paginate';
import catchAsync from '@modules/utils/catchAsync';
import pick from '@modules/utils/pick';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { UpdateFiatWalletBody } from '../interfaces/interfaces.fiat.wallet';
import * as walletService from '../services/service.fiat.wallet';

/* 
  Fiat currency Wallets
*/
export const createNewFiatWallet = catchAsync(async (req: Request, res: Response) => {
  const wallet = await walletService.createFiatWallet({
    ...req.body,
    userId: req.user.id,
  });
  res.status(httpStatus.CREATED).send(wallet);
});

// export const getAllUserFiatWallets = catchAsync(async (req: Request, res: Response) => {
//   const wallets = await walletService.getFiatWalletsByUserId(new mongoose.Types.ObjectId(req.user.id));
//   if (!wallets) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Wallets not found');
//   }
//   res.send(wallets);
// });

export const getAllUserFiatWallets = catchAsync(async (req: Request, res: Response) => {
  const filter = { ...pick(req.query, ['currencyCode', 'isActive']), userId: req.user.id };
  const options: IOptions = pick(req.query, ['sort', 'limit', 'page']);
  const result = await walletService.queryCurrencyFiatWallets(filter, options);
  res.send(result);
});

export const deactivateUserFiatWallet = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['id'] === 'string') {
    await walletService.deactivateCurrencyWalletById(
      new mongoose.Types.ObjectId(req.user.id),
      new mongoose.Types.ObjectId(req.params['id'])
    );
    res.status(httpStatus.NO_CONTENT).send();
  }
});

// export const getUserWallets = catchAsync(async (req: Request, res: Response) => {
//   const filter = { ...pick(req.query, ['currencyCode', 'currencyType', 'isActive']), userId: req.user.id };
//   const options: IOptions = pick(req.query, ['sort', 'limit', 'page']);
//   const result = await walletService.queryCurrencyWallets(filter, options);
//   res.send(result);
// });

// export const getAllCurrencyWallets = catchAsync(async (req: Request, res: Response) => {
//   const filter = pick(req.query, ['currencyId', 'currencyType', 'isActive']);
//   const options: IOptions = pick(req.query, ['sort', 'limit', 'page', 'projectBy']);
//   const result = await walletService.queryCurrencyWallets(filter, options);
//   res.send(result);
// });

// export const getCurrencyWallet = catchAsync(async (req: Request, res: Response) => {
//   if (typeof req.params['id'] === 'string') {
//     const currency = await walletService.getCurrencyWalletById(new mongoose.Types.ObjectId(req.params['id']));
//     if (!currency) {
//       throw new ApiError(httpStatus.NOT_FOUND, 'Currency not found');
//     }
//     res.send(currency);
//   }
// });

// export const deleteCurrencyWallet = catchAsync(async (req: Request, res: Response) => {
//   if (typeof req.params['id'] === 'string') {
//     await walletService.deleteCurrencyWalletById(new mongoose.Types.ObjectId(req.params['id']));
//     res.status(httpStatus.NO_CONTENT).send();
//   }
// });

/*
   DEPOSITS AND WITHDRAWALS
 */

export const createNewDepositRequest = catchAsync(async (req: Request, res: Response) => {
  const depositRequest = await walletService.createDepositRequest({
    ...req.body,
    userId: req.user.id,
  });
  res.status(httpStatus.CREATED).send(depositRequest);
});

export const queryCurrencyFiatWallets = catchAsync(async (req: Request, res: Response) => {
  const filter = { ...pick(req.query, ['currencyCode', 'isActive']) };
  const options: IOptions = pick(req.query, ['sort', 'limit', 'page']);
  const wallets = await walletService.queryCurrencyFiatWallets(filter, options);
  res.send(wallets);
});

export const getFiatWalletsByUserId = catchAsync(async (req: Request, res: Response) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const result = await walletService.getFiatWalletsByUserId(userId);
  res.send(result);
});

export const getFiatWalletByUserIdAndCurrencyCode = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { currencyCode } = req.params;
  if (!currencyCode) throw new ApiError(httpStatus.BAD_REQUEST, 'currencyCode is required');

  const result = await walletService.getFiatWalletByUserIdAndCurrencyCode(userId, currencyCode);
  res.send(result);
});

export const getExchangeFiatWallet = catchAsync(async (req: Request, res: Response) => {
  const { currencyCode } = req.params;
  if (!currencyCode) throw new ApiError(httpStatus.BAD_REQUEST, 'currencyCode is required');
  const result = await walletService.getExchangeFiatWallet(currencyCode);
  res.send(result);
});

export const getFiatWalletById = catchAsync(async (req: Request, res: Response) => {
  const walletId = new mongoose.Types.ObjectId(req.params['id']);
  const result = await walletService.getFiatWalletById(walletId);
  res.send(result);
});

export const updateFiatWalletById = catchAsync(async (req: Request, res: Response) => {
  const walletId = new mongoose.Types.ObjectId(req.params['id']);
  const updateBody: UpdateFiatWalletBody = req.body;
  const result = await walletService.updateFiatWalletById(walletId, updateBody);
  res.send(result);
});

export const activateCurrencyWalletById = catchAsync(async (req: Request, res: Response) => {
  const walletId = new mongoose.Types.ObjectId(req.params['id']);
  const result = await walletService.activateCurrencyWalletById(walletId);
  res.send(result);
});

export const deleteCurrencyWalletById = catchAsync(async (req: Request, res: Response) => {
  const walletId = new mongoose.Types.ObjectId(req.params['id']);
  const result = await walletService.deleteCurrencyWalletById(walletId);
  res.send(result);
});

export const deactivateCurrencyWalletById = catchAsync(async (req: Request, res: Response) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const walletId = new mongoose.Types.ObjectId(req.params['id']);
  const result = await walletService.deactivateCurrencyWalletById(userId, walletId);
  res.send(result);
});

/*
   DEPOSITS AND WITHDRAWALS
 */

// export const createDepositRequest = catchAsync(async (req: Request, res: Response) => {
//   const paymentPayload: NewPaymentPayload = req.body;
//   const depositRequest = await walletService.createDepositRequest(paymentPayload);
//   res.status(httpStatus.CREATED).send(depositRequest);
// });

// export const withdrawalRequest = catchAsync(async (req: Request, res: Response) => {
//   const userId = new mongoose.Types.ObjectId(req.params.userId);
//   const walletId = new mongoose.Types.ObjectId(req.params.walletId);
//   const walletCurrencyType = req.params.walletCurrencyType;
//   const result = await walletService.withdrawalRequest(userId, walletId, walletCurrencyType);
//   res.send(result);
// });

// export const exchangeFiat = catchAsync(async (req: Request, res: Response) => {
//   const userWallet: IFiatWalletDoc = req.body.userWallet;
//   const currencyCode: string = req.body.currencyCode;
//   const amount: number = req.body.amount;
//   const mode: 'SEND' | 'RECEIVE' = req.body.mode;
//   const result = await walletService.exchangeFiat(userWallet, currencyCode, amount, mode);
//   res.send(result);
// });
