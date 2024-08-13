import { CrudService } from 'expressbolt';
import { Types } from 'mongoose';
import { NewCreatedUserReferral, UserReferralI } from '../interface/interface.referral';
import REFERRAL from '../model/model.referral';
import USER_REFERRAL from '../model/model.userref';

export async function addToUserRefs(userId: Types.ObjectId, ref: Types.ObjectId) {
  // lets  find the ref if its already saved

  const getUser = await CrudService.getOne<UserReferralI>({
    modelData: {
      Model: USER_REFERRAL,
      select: [],
    },
    data: {
      ref,
      userId,
    },
    populate: {},
  });
  if (getUser.data) {
    return getUser;
  }
  const userRef = await CrudService.create<UserReferralI>({
    modelData: {
      Model: USER_REFERRAL,
      select: [],
    },
    data: {
      ref,
      userId,
      totalAmount: 0,
    },
    check: {},
  });
  if (userRef) {
    const c = await REFERRAL.findOne({ userId });
    if (c) {
      c.totalRef += 1;
      await c.save();
    }
  }
  return userRef;
}

export async function updateUserRefTotalAmount(data: NewCreatedUserReferral) {
  const user = await USER_REFERRAL.findOne({ userId: data.userId, ref: data.ref });
  if (user) {
    user.totalAmount += data.totalAmount;
    await user.save();
  }
}

export async function getUserRefs(userId: Types.ObjectId, query: any) {
  const userRef = await CrudService.getMany<UserReferralI>({
    modelData: {
      Model: USER_REFERRAL,
      select: [],
    },
    filter: { userId },
    query,

    populate: { path: 'ref', fields: ['firstName', 'lastName'] },
  });

  return userRef;
}

// admin functions

export async function getAllUserRefs(query: any) {
  const userRef = await CrudService.getMany<UserReferralI>({
    modelData: {
      Model: USER_REFERRAL,
      select: [],
    },
    filter: {},
    query,

    populate: {},
  });

  return userRef;
}

export async function deleteUserRefById(refId: Types.ObjectId) {
  const deleteRef = await CrudService.delete<UserReferralI>({
    modelData: {
      Model: USER_REFERRAL,
      select: [],
    },
    data: {
      _id: refId,
    },
  });
  return deleteRef;
}

export async function getUserRefById(refId: Types.ObjectId) {
  const getRef = await CrudService.getOne<UserReferralI>({
    modelData: {
      Model: USER_REFERRAL,
      select: [],
    },
    data: {
      _id: refId,
    },
    populate: {},
  });
  return getRef;
}
