// create branch
import { CrudService } from "expressbolt";
import { WORKING_HOURS } from "../models/model.hours";
export async function createWorkingHours(data) {
    const createdWorkingHours = await CrudService.create({
        data: Object.assign({}, data), check: {}, modelData: {
            Model: WORKING_HOURS, select: []
        }
    });
    return createdWorkingHours;
}
export async function getWorkingHours(id) {
    const branch = await CrudService.getOne({
        data: { _id: id }, modelData: { Model: WORKING_HOURS, select: [] }, populate: []
    });
    return branch;
}
export async function updateWorkingHours(data, id) {
    const updatedWorkingHours = await CrudService.update({
        data: data, modelData: { Model: WORKING_HOURS, select: [] }, filter: { _id: id }
    });
    return updatedWorkingHours;
}
export async function deleteWorkingHours(id) {
    const deletedWorkingHours = await CrudService.delete({
        data: { _id: id }, modelData: { Model: WORKING_HOURS, select: [] }
    });
    return deletedWorkingHours;
}
export async function getAllWorkingHours(query) {
    const branches = await CrudService.getMany({
        query: query, modelData: { Model: WORKING_HOURS, select: [] }, filter: {}, populate: []
    });
    return branches;
}
export async function getWorkingHoursByBranch(branch, query) {
    const b = await CrudService.getMany({
        modelData: { Model: WORKING_HOURS, select: [] }, populate: {}, filter: { branch }, query: query
    });
    return b;
}
//# sourceMappingURL=service.hours.js.map