import { IOptions } from '@modules/paginate/paginate';
import { catchAsync, pick } from '@modules/utils';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { IVirtualAccountServicePayload } from './interface.virtual';
import * as virtualService from './service.virtual';

export const createAccountController = catchAsync(async (req: Request, res: Response) => {
  const data: Pick<IVirtualAccountServicePayload, 'bvn' | 'user'> = {
    bvn: req.body.bvn,
    user: req.user,
  };
  const created = await virtualService.createVirtualAccount(data);
  res.send(created);
});

export const fetchAccountController = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, [
    'bvn',
    'accountNumber',
    'accountName',
    'walletId',
    'userId',
    'bankName',
    'orderRef',
    'flwRef',
  ]);
  const options: IOptions = pick(req.query, ['sort', 'limit', 'page', 'projectBy']);

  const data = await virtualService.queryVirtualAccounts(filter, options);
  res.send(data);
});

export const fetchAccountByIdController = catchAsync(async (req: Request, res: Response) => {
  const id = new Types.ObjectId(req.params['id']);
  const data = await virtualService.getVirtualAccountById(id);
  res.send(data);
});

export const fetchAccountByUserIdController = catchAsync(async (req: Request, res: Response) => {
  const userId: Types.ObjectId = req.user._id;
  const data = await virtualService.getVirtualAccountByUserId(userId);
  res.send(data);
});

export const getAccountByWalletIdController = catchAsync(async (req: Request, res: Response) => {
  const { walletId } = req.body;
  const data = await virtualService.getVirtualAccountByWalletId(walletId);
  res.send(data);
});

export const deleteVirtualAccountByUserId = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user._id;
  const deleted = await virtualService.deleteVirtualAccountByUserId(userId);
  res.send(deleted);
});
export const deleteVirtualAccountById = catchAsync(async (req: Request, res: Response) => {
  const id = new Types.ObjectId(req.params['id']);
  const deleted = await virtualService.deleteVirtualAccountById(id);
  res.send(deleted);
});
