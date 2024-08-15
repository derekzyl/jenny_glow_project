// create branch
import { easyReferenceGenerator, GeneratekeyE, GeneratePrefixType } from "../../utils/referenceGenerator";
import { CrudService } from "expressbolt";
import { shipping } from '../../admin/shipping/countries_states';
import { BRANCH } from "../models/model.branch";
import { WORKING_HOURS } from "../models/model.hours";
export function generateBranchReference(data) {
    var _a;
    const cs = JSON.parse(JSON.stringify(shipping));
    const getCountry = cs.find((c) => data.country.toLowerCase() === c.name.toLowerCase());
    const countryShortCode = getCountry === null || getCountry === void 0 ? void 0 : getCountry.iso2.toLowerCase();
    const stateShortCode = (_a = getCountry === null || getCountry === void 0 ? void 0 : getCountry.states.find((s) => data.state.toLowerCase() === s.name.toLowerCase())) === null || _a === void 0 ? void 0 : _a.state_code.toLowerCase();
    const branchTypeShortCode = easyReferenceGenerator({ addDash: true, prefix: GeneratePrefixType.BRANCH, size: 4, type: GeneratekeyE.alphanumLower });
    const branchCode = `${countryShortCode}-${stateShortCode}-${branchTypeShortCode}`;
    return branchCode;
}
export async function createBranch(data) {
    const createBranchCode = generateBranchReference({ country: data.country, state: data.state });
    const createdBranch = await CrudService.create({
        data: Object.assign(Object.assign({}, data), { branchCode: createBranchCode, numberOfEmployees: 0 }), check: {}, modelData: {
            Model: BRANCH, select: []
        }
    });
    if (data.workingHours && createdBranch["data"]) {
        await Promise.all(data.workingHours.map(async (workingHour) => {
            await CrudService.create({
                data: Object.assign(Object.assign({}, workingHour), { branch: createdBranch["data"]._id }), check: {}, modelData: { Model: WORKING_HOURS, select: [] }
            });
        }));
    }
    return createdBranch;
}
export async function getBranchById(id) {
    const branch = await CrudService.getOne({
        data: { _id: id }, modelData: { Model: BRANCH, select: [] }, populate: []
    });
    return branch;
}
export async function getOneBranch(data) {
    const branch = await CrudService.getOne({
        data, modelData: { Model: BRANCH, select: [] }, populate: []
    });
    return branch;
}
export async function updateBranch(data, id) {
    const updatedBranch = await CrudService.update({
        data: data, modelData: { Model: BRANCH, select: [] }, filter: { _id: id }
    });
    return updatedBranch;
}
export async function deleteBranch(id) {
    const deletedBranch = await CrudService.delete({
        data: { _id: id }, modelData: { Model: BRANCH, select: [] }
    });
    return deletedBranch;
}
export async function getAllBranch(query) {
    const branches = await CrudService.getMany({
        query: query, modelData: { Model: BRANCH, select: [] }, filter: {}, populate: []
    });
    return branches;
}
export async function getBranchByCode(branchCode) {
    const branch = await CrudService.getOne({
        data: { branchCode }, modelData: { Model: BRANCH, select: [] }, populate: {},
    });
    return branch;
}
export async function getBranchByManager(managerId) {
    const branch = await CrudService.getOne({
        data: { branchManager: managerId }, modelData: { Model: BRANCH, select: [] }, populate: {},
    });
    return branch;
}
export async function getBranchByName(branchName) {
    const branch = await CrudService.getOne({
        data: { name: branchName }, modelData: { Model: BRANCH, select: [] }, populate: {},
    });
    return branch;
}
export async function getBranchManagerUserId() {
    const branches = await CrudService.getMany({
        query: {}, modelData: { Model: BRANCH, select: [] }, filter: {}, populate: {},
    });
    return branches;
}
//# sourceMappingURL=service.branch.js.map