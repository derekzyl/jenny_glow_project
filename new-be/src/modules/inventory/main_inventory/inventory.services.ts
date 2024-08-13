import { transactionsService } from "@modules/transactions";
import { TrxCrudTypes, TrxTypes } from "@modules/transactions/interfaces/interfaces.transactions";
import { easyReferenceGenerator, GeneratekeyE, GeneratePrefixType } from "@modules/utils/referenceGenerator";
import { GeneralStatus } from "@modules/utils/utils";
import { CrudService } from "expressbolt";
import { Types } from "mongoose";
import { InventoryBodyT, InventoryI } from "../interface_inventory/interface.inventory";
import { INVENTORY, INVENTORY_ITEM } from "./model.inventory";




export async function createInventory (data:InventoryBodyT&{createdBy:Types.ObjectId}) {
    const refId = easyReferenceGenerator({
        addDash: true,
        prefix:GeneratePrefixType.INVENTORY,size:16,type:GeneratekeyE.alphanumLower
    })
    const { inventoryItems, ...rest } = data;
    const totalInventoryItems = inventoryItems.length;
    let totalInventoryPrice = 0;
    for (const item of inventoryItems) {
        totalInventoryPrice += item.totalPrice;
    }


    const createInventory = await CrudService.create<InventoryI>({
        modelData: {
            Model: INVENTORY,
            select:[]
        }, data: {
            ...rest,
            refId,
            totalInventoryItems,
            totalInventoryPrice,
            inventoryStatus: GeneralStatus.PENDING,
            updatedBy: data.createdBy
        },check:{}
    })


    const inventoryId = createInventory['data']!.id;
    const inventoryItemsData = inventoryItems.map((item) => ({ ...item, inventoryId }));

   const createInventoryItems =  await CrudService.createMany({
        modelData: {
            Model: INVENTORY_ITEM,
            select:[]
        }, data: inventoryItemsData, check: []
    })

    const { data: invData, message, success, } = createInventory
    const { data: invItemData, } = createInventoryItems
    await transactionsService.createTransaction({
        amount: totalInventoryPrice,
        referenceId: inventoryId,
        trxRef: refId,


        status: GeneralStatus.PENDING,
        createdBy: data.createdBy,
        trxType: TrxTypes.INVENTORY,
        details: `Inventory purchase of ${totalInventoryItems} items`,
        notes: `Inventory purchase of ${totalInventoryItems} items`,
        trxCrudType: TrxCrudTypes.CREATE,
    })
    return { data: { invData, invItemData }, message, success }
    // 
    
}

export async function getOneInventory (inventoryId:Types.ObjectId) {
    const getInventory = await CrudService.getOne<InventoryI>({
        modelData: {
            Model: INVENTORY,
            select:[]
        }, data:{id:inventoryId}, populate:{}
    })

    const getInventoryItems = await CrudService.getMany<InventoryI>({
        modelData: {
            Model: INVENTORY_ITEM,
            select:[]
        }, filter:{inventoryId},populate:{}, query:{}
    })

    const { data: invData, message, success, } = getInventory
    const { data: invItemData, } = getInventoryItems
    return { data: { invData, invItemData }, message, success }
}

export async function getManyInventory (query:Record<string,any>) {
    const getInventory = await CrudService.getMany<InventoryI>({
        modelData: {
            Model: INVENTORY,
            select:[]
        }, filter:{},populate:{}, query
    })



  return getInventory
}

export async function updateInventory (inventoryId:Types.ObjectId, data:InventoryBodyT&{updatedBy:Types.ObjectId}) {
    const { inventoryItems, ...rest } = data;
    const totalInventoryItems = inventoryItems.length;
    // we will need to delete existing inventory items and create new ones
   await INVENTORY_ITEM.deleteMany({ inventoryId });

    let totalInventoryPrice = 0;
    for (const item of inventoryItems) {
        totalInventoryPrice += item.totalPrice;
    }

    const updateInventory = await CrudService.update<InventoryI>({
        modelData: {
            Model: INVENTORY,
            select:[]
        }, filter:{id:inventoryId}, data:{
            ...rest,
            totalInventoryItems,
            totalInventoryPrice,
            updatedBy: data.updatedBy
        }
    })

    const inventoryItemsData = inventoryItems.map((item) => ({ ...item, inventoryId }));

    const updateInventoryItems = await CrudService.createMany({
        modelData: {
            Model: INVENTORY_ITEM,
            select:[]
        }, data: inventoryItemsData, check: []
    })

    await transactionsService.createTransaction({
        amount: totalInventoryPrice,
        referenceId: inventoryId.toString(),
        trxRef: updateInventory['data']!.refId,
        status: GeneralStatus.PENDING,
        createdBy: data.updatedBy,
        trxType: TrxTypes.INVENTORY,
        details: `Inventory purchase of ${totalInventoryItems} items`,
        notes: `Inventory purchase of ${totalInventoryItems} items`,
        trxCrudType: TrxCrudTypes.UPDATE,
    })

    const { data: invData, message, success, } = updateInventory
    const { data: invItemData, } = updateInventoryItems
    return { data: { invData, invItemData }, message, success }
}


export async function deleteInventory (inventoryId:Types.ObjectId) {
    const deleteInventory = await CrudService.delete<InventoryI>({
        modelData: {
            Model: INVENTORY,
            select:[]
        }, data:{id:inventoryId}
    })

   await INVENTORY_ITEM.deleteMany({ inventoryId });


    return deleteInventory;
}

export async function updateInventoryStatus (inventoryId:Types.ObjectId, status:GeneralStatus) {
    const updateInventory = await CrudService.update<InventoryI>({
        modelData: {
            Model: INVENTORY,
            select:[]
        }, filter:{id:inventoryId}, data:{
            inventoryStatus: status
        }
    })

    return updateInventory;
}