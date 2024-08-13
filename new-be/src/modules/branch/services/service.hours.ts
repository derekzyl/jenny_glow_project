
// create branch

import { CrudService } from "expressbolt";
import { Types } from "mongoose";
import { workingHoursI } from "../interface_branch/interface.branch";
import { WORKING_HOURS } from "../models/model.hours";





export async function createWorkingHours (data: workingHoursI) {
    
  const createdWorkingHours = await CrudService.create < workingHoursI> ({
        data:{
            ...data
        }, check: {}, modelData: {
            Model: WORKING_HOURS, select:[]
        }
    })

    return createdWorkingHours


}

export async function getWorkingHours (id: Types.ObjectId) {
    const branch = await CrudService.getOne<workingHoursI>({
        data: {_id: id}, modelData: {Model: WORKING_HOURS, select: []}, populate: []
    })

    return branch
}


export async function updateWorkingHours (data: Omit<workingHoursI, "createdBy"> & {
    updatedBy: Types.ObjectId
}, id: Types.ObjectId) {
    const updatedWorkingHours = await CrudService.update<workingHoursI>({
        data: data, modelData: {Model: WORKING_HOURS, select: []}, filter: {_id: id}
    })

    return updatedWorkingHours
}

export async function deleteWorkingHours (id: Types.ObjectId) {
    const deletedWorkingHours = await CrudService.delete<workingHoursI>({
        data: {_id: id}, modelData: {Model: WORKING_HOURS, select: []}
    })

    return deletedWorkingHours
}

export async function getAllWorkingHours (query: Record<string, any>) {
    const branches = await CrudService.getMany<workingHoursI>({
        query: query, modelData: { Model: WORKING_HOURS, select: [] }, filter: {}, populate: []
    })

    return branches
}

export async function getWorkingHoursByBranch (branch: Types.ObjectId, query: Record<string, any>) { 
    const b = await CrudService.getMany<workingHoursI>({
         modelData: { Model: WORKING_HOURS, select: [] }, populate: {},filter:{branch}, query:query
    })
    return b
}