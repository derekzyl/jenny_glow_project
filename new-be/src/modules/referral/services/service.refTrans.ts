import { CrudService } from 'expressbolt';
import { Types } from 'mongoose';
import { NewCreatedRefTransaction, RefTransactionI } from '../interface/interface.referral';
import REF_BONUS from '../model/model.refbonus';

export async function createRefTransation(data: NewCreatedRefTransaction) {
  // lets  find the ref if its already saved

  const userRef = await CrudService.create<RefTransactionI>({
    modelData: {
      Model: REF_BONUS,
      select: [],
    },
    data,
    check: {},
  });

  return userRef;
}

export async function getRefTransation(userId: Types.ObjectId, query: any) {
  const userRef = await CrudService.getMany<RefTransactionI>({
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

export async function getAllRefTransation(query: any) {
  const userRef = await CrudService.getMany<RefTransactionI>({
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

export async function deleteRefTransationById(refId: Types.ObjectId) {
  const deleteRef = await CrudService.delete<RefTransactionI>({
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

export async function getRefTransationById(refId: Types.ObjectId) {
  const getRef = await CrudService.getOne<RefTransactionI>({
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
