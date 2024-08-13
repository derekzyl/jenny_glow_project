/* eslint-disable import/no-cycle */
import { notificationService } from '@modules/notification';
import { easyReferenceGenerator, GeneratekeyE, GeneratePrefixType } from '@modules/utils/referenceGenerator';
import { CrudService } from 'expressbolt';
import { Types } from 'mongoose';
import { refService, refTransService } from '..';
import { NewCreatedRefsBonus, RefsBonusI } from '../interface/interface.referral';
import REF_BONUS from '../model/model.refbonus';
import { updateUserRefTotalAmount } from './service.userref';

export async function createRefBonus(data: NewCreatedRefsBonus) {
  // lets  find the ref if its already saved

  const userRef = await CrudService.create<RefsBonusI>({
    modelData: {
      Model: REF_BONUS,
      select: [],
    },
    data,
    check: {},
  });
  await refService.addToReferralBalance(data.userId, data.bonus);
  await updateUserRefTotalAmount({ ref: data.referral, totalAmount: data.bonus, userId: data.userId });
  await refTransService.createRefTransation({
    amount: data.bonus,
    fee: 0,
    referral: data.referral,
    status: 'SUCCESS',
    transType: 'DEPOSIT',
    userId: data.userId,
    type: data.type,
    reference: easyReferenceGenerator({
      size: 16,
      addDash: true,
      prefix: GeneratePrefixType.REFERRAL,
      type: GeneratekeyE.alphanumLower,
    }),
  });

  notificationService.sendNotification({
    body: `${String(data.type).toLowerCase()} bonus received `,
    type: data.type,
    title: `referral bonus`,
    nType: 'notification',
    userId: data.userId,
  });
  return userRef;
}

export async function getRefBonus(userId: Types.ObjectId, query: any) {
  const userRef = await CrudService.getMany<RefsBonusI>({
    modelData: {
      Model: REF_BONUS,
      select: [],
    },
    filter: { userId },
    query,

    populate: { path: 'referral', fields: ['firstName', 'lastName'] },
  });

  return userRef;
}

// admin functions

export async function getAllRefBonus(query: any) {
  const userRef = await CrudService.getMany<RefsBonusI>({
    modelData: {
      Model: REF_BONUS,
      select: [],
    },
    filter: {},
    query,

    populate: {},
  });

  return userRef;
}

export async function deleteRefBonusById(refId: Types.ObjectId) {
  const deleteRef = await CrudService.delete<RefsBonusI>({
    modelData: {
      Model: REF_BONUS,
      select: [],
    },
    data: {
      _id: refId,
    },
  });
  return deleteRef;
}

export async function getRefBonusById(refId: Types.ObjectId) {
  const getRef = await CrudService.getOne<RefsBonusI>({
    modelData: {
      Model: REF_BONUS,
      select: [],
    },
    data: {
      _id: refId,
    },
    populate: {},
  });
  return getRef;
}
