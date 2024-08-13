// create a beneficiary
// get a beneficiary
// delete a beneficiary
import { CrudService } from 'expressbolt';
import BENEFICIARY from './model';
export async function createBeneficiary(data) {
    const createBe = await CrudService.create({
        modelData: {
            Model: BENEFICIARY,
            select: [],
        },
        check: {},
        data,
    });
    return createBe;
}
export async function UpdateBeneficiary(data, update) {
    const updateBe = (await CrudService.update)({
        modelData: {
            Model: BENEFICIARY,
            select: [],
        },
        filter: update,
        data,
    });
    return updateBe;
}
export async function getBeneficiaryById(id) {
    const getBe = await CrudService.getOne({
        modelData: {
            Model: BENEFICIARY,
            select: [],
        },
        data: { _id: id },
        populate: {},
    });
    return getBe;
}
export async function getBeneficiariesByUserId(userId, query) {
    const getBe = await CrudService.getMany({
        modelData: {
            Model: BENEFICIARY,
            select: [],
        },
        query,
        filter: { userId },
        populate: {},
    });
    return getBe;
}
export async function getBeneficiaries(query) {
    const getBe = await CrudService.getMany({
        modelData: {
            Model: BENEFICIARY,
            select: [],
        },
        query,
        populate: {},
        filter: {},
    });
    return getBe;
}
export async function deleteBeneficiaries() {
    const deleteBe = await CrudService.deleteMany({
        modelData: {
            Model: BENEFICIARY,
            select: [],
        },
        data: {},
    });
    return deleteBe;
}
export async function deleteUserBeneficiaries(userId) {
    const deleteBe = await CrudService.deleteMany({
        modelData: {
            Model: BENEFICIARY,
            select: [],
        },
        data: { userId },
    });
    return deleteBe;
}
export async function getUserBeneficiaryFav(userId, query) {
    const getBe = await CrudService.getMany({
        modelData: {
            Model: BENEFICIARY,
            select: [],
        },
        query,
        filter: { userId, isFavourite: true },
        populate: {},
    });
    return getBe;
}
//# sourceMappingURL=service.js.map