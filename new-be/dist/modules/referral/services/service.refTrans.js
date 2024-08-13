import { CrudService } from 'expressbolt';
import REF_BONUS from '../model/model.refbonus';
export async function createRefTransation(data) {
    // lets  find the ref if its already saved
    const userRef = await CrudService.create({
        modelData: {
            Model: REF_BONUS,
            select: [],
        },
        data,
        check: {},
    });
    return userRef;
}
export async function getRefTransation(userId, query) {
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
export async function getAllRefTransation(query) {
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
export async function deleteRefTransationById(refId) {
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
export async function getRefTransationById(refId) {
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
//# sourceMappingURL=service.refTrans.js.map