/* eslint-disable import/no-cycle */
import { notificationService } from '../../notification';
import { easyReferenceGenerator, GeneratekeyE, GeneratePrefixType } from '../../utils/referenceGenerator';
import { CrudService } from 'expressbolt';
import { refService, refTransService } from '..';
import REF_BONUS from '../model/model.refbonus';
import { updateUserRefTotalAmount } from './service.userref';
export async function createRefBonus(data) {
    // lets  find the ref if its already saved
    const userRef = await CrudService.create({
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
export async function getRefBonus(userId, query) {
    const userRef = await CrudService.getMany({
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
export async function getAllRefBonus(query) {
    const userRef = await CrudService.getMany({
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
export async function deleteRefBonusById(refId) {
    const deleteRef = await CrudService.delete({
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
export async function getRefBonusById(refId) {
    const getRef = await CrudService.getOne({
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
//# sourceMappingURL=service.refbonus.js.map