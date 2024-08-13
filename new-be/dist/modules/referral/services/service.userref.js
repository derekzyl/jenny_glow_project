import { CrudService } from 'expressbolt';
import REFERRAL from '../model/model.referral';
import USER_REFERRAL from '../model/model.userref';
export async function addToUserRefs(userId, ref) {
    // lets  find the ref if its already saved
    const getUser = await CrudService.getOne({
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
    const userRef = await CrudService.create({
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
export async function updateUserRefTotalAmount(data) {
    const user = await USER_REFERRAL.findOne({ userId: data.userId, ref: data.ref });
    if (user) {
        user.totalAmount += data.totalAmount;
        await user.save();
    }
}
export async function getUserRefs(userId, query) {
    const userRef = await CrudService.getMany({
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
export async function getAllUserRefs(query) {
    const userRef = await CrudService.getMany({
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
export async function deleteUserRefById(refId) {
    const deleteRef = await CrudService.delete({
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
export async function getUserRefById(refId) {
    const getRef = await CrudService.getOne({
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
//# sourceMappingURL=service.userref.js.map