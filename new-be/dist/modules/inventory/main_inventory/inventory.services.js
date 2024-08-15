var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { transactionsService } from "../../transactions";
import { TrxCrudTypes, TrxTypes } from "../../transactions/interfaces/interfaces.transactions";
import { easyReferenceGenerator, GeneratekeyE, GeneratePrefixType } from "../../utils/referenceGenerator";
import { GeneralStatus } from "../../utils/utils";
import { CrudService } from "expressbolt";
import { INVENTORY, INVENTORY_ITEM } from "./model.inventory";
export async function createInventory(data) {
    const refId = easyReferenceGenerator({
        addDash: true,
        prefix: GeneratePrefixType.INVENTORY, size: 16, type: GeneratekeyE.alphanumLower
    });
    const { inventoryItems } = data, rest = __rest(data, ["inventoryItems"]);
    const totalInventoryItems = inventoryItems.length;
    let totalInventoryPrice = 0;
    for (const item of inventoryItems) {
        totalInventoryPrice += item.totalPrice;
    }
    const createInventory = await CrudService.create({
        modelData: {
            Model: INVENTORY,
            select: []
        }, data: Object.assign(Object.assign({}, rest), { refId,
            totalInventoryItems,
            totalInventoryPrice, inventoryStatus: GeneralStatus.PENDING, updatedBy: data.createdBy }), check: {}
    });
    const inventoryId = createInventory['data'].id;
    const inventoryItemsData = inventoryItems.map((item) => (Object.assign(Object.assign({}, item), { inventoryId })));
    const createInventoryItems = await CrudService.createMany({
        modelData: {
            Model: INVENTORY_ITEM,
            select: []
        }, data: inventoryItemsData, check: []
    });
    const { data: invData, message, success, } = createInventory;
    const { data: invItemData, } = createInventoryItems;
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
    });
    return { data: { invData, invItemData }, message, success };
    // 
}
export async function getOneInventory(inventoryId) {
    const getInventory = await CrudService.getOne({
        modelData: {
            Model: INVENTORY,
            select: []
        }, data: { id: inventoryId }, populate: {}
    });
    const getInventoryItems = await CrudService.getMany({
        modelData: {
            Model: INVENTORY_ITEM,
            select: []
        }, filter: { inventoryId }, populate: {}, query: {}
    });
    const { data: invData, message, success, } = getInventory;
    const { data: invItemData, } = getInventoryItems;
    return { data: { invData, invItemData }, message, success };
}
export async function getManyInventory(query) {
    const getInventory = await CrudService.getMany({
        modelData: {
            Model: INVENTORY,
            select: []
        }, filter: {}, populate: {}, query
    });
    return getInventory;
}
export async function updateInventory(inventoryId, data) {
    const { inventoryItems } = data, rest = __rest(data, ["inventoryItems"]);
    const totalInventoryItems = inventoryItems.length;
    // we will need to delete existing inventory items and create new ones
    await INVENTORY_ITEM.deleteMany({ inventoryId });
    let totalInventoryPrice = 0;
    for (const item of inventoryItems) {
        totalInventoryPrice += item.totalPrice;
    }
    const updateInventory = await CrudService.update({
        modelData: {
            Model: INVENTORY,
            select: []
        }, filter: { id: inventoryId }, data: Object.assign(Object.assign({}, rest), { totalInventoryItems,
            totalInventoryPrice, updatedBy: data.updatedBy })
    });
    const inventoryItemsData = inventoryItems.map((item) => (Object.assign(Object.assign({}, item), { inventoryId })));
    const updateInventoryItems = await CrudService.createMany({
        modelData: {
            Model: INVENTORY_ITEM,
            select: []
        }, data: inventoryItemsData, check: []
    });
    await transactionsService.createTransaction({
        amount: totalInventoryPrice,
        referenceId: inventoryId.toString(),
        trxRef: updateInventory['data'].refId,
        status: GeneralStatus.PENDING,
        createdBy: data.updatedBy,
        trxType: TrxTypes.INVENTORY,
        details: `Inventory purchase of ${totalInventoryItems} items`,
        notes: `Inventory purchase of ${totalInventoryItems} items`,
        trxCrudType: TrxCrudTypes.UPDATE,
    });
    const { data: invData, message, success, } = updateInventory;
    const { data: invItemData, } = updateInventoryItems;
    return { data: { invData, invItemData }, message, success };
}
export async function deleteInventory(inventoryId) {
    const deleteInventory = await CrudService.delete({
        modelData: {
            Model: INVENTORY,
            select: []
        }, data: { id: inventoryId }
    });
    await INVENTORY_ITEM.deleteMany({ inventoryId });
    return deleteInventory;
}
export async function updateInventoryStatus(inventoryId, status) {
    const updateInventory = await CrudService.update({
        modelData: {
            Model: INVENTORY,
            select: []
        }, filter: { id: inventoryId }, data: {
            inventoryStatus: status
        }
    });
    return updateInventory;
}
//# sourceMappingURL=inventory.services.js.map