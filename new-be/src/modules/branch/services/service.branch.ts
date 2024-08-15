// create branch

import { CountryI } from "@modules/admin/shipping/interface_shipping/interface.shipping";
import { easyReferenceGenerator, GeneratekeyE, GeneratePrefixType } from "@modules/utils/referenceGenerator";
import { CrudService } from "expressbolt";
import { Types } from "mongoose";
import { shipping } from '../../admin/shipping/countries_states';
import { branchBodyT, BranchI } from "../interface_branch/interface.branch";
import { BRANCH } from "../models/model.branch";
import { WORKING_HOURS } from "../models/model.hours";



export function generateBranchReference(data:{country: string, state: string}):string {
const cs: CountryI[] = JSON.parse(JSON.stringify(shipping))
    
    const getCountry = cs.find((c) => data.country.toLowerCase() === c.name.toLowerCase())
    const countryShortCode = getCountry?.iso2.toLowerCase()
    const stateShortCode = getCountry?.states.find((s) => data.state.toLowerCase() === s.name.toLowerCase())?.state_code.toLowerCase()
    const branchTypeShortCode = easyReferenceGenerator({ addDash: true, prefix: GeneratePrefixType.BRANCH, size: 4, type: GeneratekeyE.alphanumLower })
    const branchCode = `${countryShortCode}-${stateShortCode}-${branchTypeShortCode}`

    return branchCode

}

export async function createBranch (data: branchBodyT) {
    
    const createBranchCode = generateBranchReference({ country: data.country, state: data.state })
    const createdBranch = await CrudService.create < BranchI> ({
        data:{
            ...data, branchCode: createBranchCode,
           
            numberOfEmployees: 0
        }, check: {}, modelData: {
            Model: BRANCH, select:[]
        }
    })
    if (data.workingHours&& createdBranch["data"]) {
        await Promise.all(data.workingHours.map(async (workingHour) => { 
            await CrudService.create({
                data: { ...workingHour, branch: createdBranch["data"]!._id! }, check: {}, modelData: { Model: WORKING_HOURS, select: [] }
            })
        }))
}
    return createdBranch


}

export async function getBranchById (id: Types.ObjectId) {
    const branch = await CrudService.getOne<BranchI>({
        data: {_id: id}, modelData: {Model: BRANCH, select: []}, populate: []
    })

    return branch
}
export async function getOneBranch (data:Partial<BranchI>) {
    const branch = await CrudService.getOne<BranchI>({
        data, modelData: {Model: BRANCH, select: []}, populate: []
    })

    return branch
}


export async function updateBranch (data: Omit<branchBodyT, "createdBy"> & {
    updatedBy: Types.ObjectId
}, id: Types.ObjectId) {
    const updatedBranch = await CrudService.update<BranchI>({
        data: data, modelData: {Model: BRANCH, select: []}, filter: {_id: id}
    })

    return updatedBranch
}

export async function deleteBranch (id: Types.ObjectId) {
    const deletedBranch = await CrudService.delete<BranchI>({
        data: {_id: id}, modelData: {Model: BRANCH, select: []}
    })

    return deletedBranch
}

export async function getAllBranch (query: Record<string, any>) {
    const branches = await CrudService.getMany<BranchI>({
        query: query, modelData: { Model: BRANCH, select: [] }, filter: {}, populate: []
    })

    return branches
}

export async function getBranchByCode (branchCode: string) { 
    const branch = await CrudService.getOne<BranchI>({
        data: { branchCode }, modelData: { Model: BRANCH, select: [] }, populate: {},
    })
    return branch
}

export async function getBranchByManager (managerId: Types.ObjectId) { 
    const branch = await CrudService.getOne<BranchI>({
        data: { branchManager: managerId }, modelData: { Model: BRANCH, select: [] }, populate: {},
    })
    return branch
}

export async function getBranchByName (branchName: string) {
    const branch = await CrudService.getOne<BranchI>({
        data: { name: branchName }, modelData: { Model: BRANCH, select: [] }, populate: {},
    })
    return branch
 }

export async function getBranchManagerUserId () {
    const branches = await CrudService.getMany<BranchI>({
        query: {}, modelData: { Model: BRANCH, select: [] }, filter: {}, populate: {},
    })
    return branches
 }


