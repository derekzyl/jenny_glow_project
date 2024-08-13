import { Request, Response } from "express";

import { roleServices } from "@modules/admin/Roles";
import { staffService } from "@modules/admin/staff";
import { branchService } from "@modules/branch";
import { ApiError } from "@modules/errors";
import { notificationService } from "@modules/notification";
import { allPermissions } from "@modules/setting/roles";
import { catchAsync } from "@modules/utils";
import { imageDeleteHandler } from "@modules/utils/file_handler/files_handler";
import { Types } from "mongoose";
import * as InventoryService from "./inventory.services";

//todo inventory receipt
export const createInventory = catchAsync(async (req:Request, res:Response) => {
  const getUserPermissions = await roleServices.checkStaffPermission(req.user._id, [allPermissions.SuperAdmin, allPermissions.Admin])
const branchId= req.body.branchId
  if (!getUserPermissions) {
    const getBranchByManager = await staffService.getStaffByUserId(req.user._id);
    if (!getBranchByManager) throw new ApiError(403, "You do not have permission to perform this action")  
    
    if(!getBranchByManager?.branchId.equals(branchId)) throw new ApiError(403, "You do not have permission to perform this action")

    // return res.status(403).json({ message: "You do not have permission to perform this action" });
  }
 const createInv= await  InventoryService.createInventory({...req.body, createdBy: req.user._id})
  if (createInv.success) {
    notificationService.sendNotificationToManager({
      body: "New Inventory created",
      title: "New Inventory",
      type: "inventory",
      branchId: req.body.branchId,
  })
}
res.status(201).json(createInv)
})

export const getOneInventory = catchAsync(async (
  request: Request,
  response: Response,
 
) => {

  const getOne = await InventoryService.getOneInventory(new Types.ObjectId (request.params["id"]));

response.json(getOne)
});

export const getManyInventory = catchAsync(async (
  request: Request,
  response: Response,

) => {
    const getUserPermissions = await roleServices.checkStaffPermission(request.user._id, [
      allPermissions.SuperAdmin,
      allPermissions.Admin,
    ]);
let query:any= request.query;

    if (!getUserPermissions) {
      const getBranchByManager = await staffService.getStaffByUserId(request.user._id);
      if (!getBranchByManager) throw new ApiError(403, 'You do not have permission to perform this action');

     query = { ...request.query, branchId: getBranchByManager.branchId };
      // return res.status(403).json({ message: "You do not have permission to perform this action" });
    }
  const getMany = await InventoryService.getManyInventory(query)
  response.json(getMany)
});

export const updateInventory =catchAsync( async (
  request: Request,
  response: Response,

) => {
  const body = request.body;
    const getUserPermissions = await roleServices.checkStaffPermission(request.user._id, [
      allPermissions.SuperAdmin,
      allPermissions.Admin,
    ]);
  const getInventory = await InventoryService.getOneInventory(new Types.ObjectId(request.params["id"]));
  if (!getInventory['data']) throw new ApiError(404, 'Inventory not found');
  const branchId = getInventory['data'].invData?.branchId;
  if (body.inventoryReceipt) {
    


    getInventory['data'].invData &&getInventory['data'].invData.inventoryReceipt ? imageDeleteHandler(getInventory['data']!.invData!.inventoryReceipt) : "";
  }

    if (!getUserPermissions) {
      const getBranchByManager = await staffService.getStaffByUserId(request.user._id);
      if (!getBranchByManager) throw new ApiError(403, 'You do not have permission to perform this action');

      if (!getBranchByManager?.branchId.equals(branchId))
        throw new ApiError(403, 'You do not have permission to perform this action');

      // return res.status(403).json({ message: "You do not have permission to perform this action" });
    }
  
  const update = await InventoryService.updateInventory(new Types.ObjectId(request.params["id"]), {...body, updatedBy: request.user._id})
  response.json(update)
});
export const deleteInventory = catchAsync(async (
  request: Request,
  response: Response,
 
) => {

    const getUserPermissions = await roleServices.checkStaffPermission(request.user._id, [
      allPermissions.SuperAdmin,
      allPermissions.Admin,
    ]);
    const getInventory = await InventoryService.getOneInventory(new Types.ObjectId(request.params['id']));
    if (!getInventory['data']) throw new ApiError(404, 'Inventory not found');
    const branchId = getInventory['data'].invData?.branchId;

    if (!getUserPermissions) {
      const getBranchByManager = await staffService.getStaffByUserId(request.user._id);
      if (!getBranchByManager) throw new ApiError(403, 'You do not have permission to perform this action');

      if (!getBranchByManager?.branchId.equals(branchId))
        throw new ApiError(403, 'You do not have permission to perform this action');

      // return res.status(403).json({ message: "You do not have permission to perform this action" });
    }
  const del = await InventoryService.deleteInventory(new Types.ObjectId(request.params["id"]))
  response.json(del)
}
)



export const getBranchInventory = catchAsync(async (
  request: Request,
  response: Response,
 
) => {
  const getBranchInventory = InventoryService.getManyInventory({ branchId: request.params["id"], ...request.query });
response.json(getBranchInventory)
});


export const getBranchInventoryByUserId = catchAsync(async (req: Request, res: Response) => {
  const getStffByUserId =await staffService.getStaffByUserId(req.user._id);
  const getBranchInventory = InventoryService.getManyInventory({ branchId:getStffByUserId?.branchId, ...req.query });
  res.json(getBranchInventory);
})


export const getBranchInventoryByManagerId = catchAsync(async (req: Request, res: Response) => {
  const getBranchByManager =await branchService.getBranchByManager(new Types.ObjectId(req.params["id"]));
  const getBranchInventory = InventoryService.getManyInventory({ branchId: getBranchByManager['data']!.id, ...req.query });
  res.json(getBranchInventory);
})


export const approveInventory = catchAsync(async (req: Request, res: Response) => {
  






      const getUserPermissions = await roleServices.checkStaffPermission(req.user._id, [
      allPermissions.SuperAdmin,
      allPermissions.Admin,
    ]);
    const getInventory = await InventoryService.getOneInventory(new Types.ObjectId(req.params['id']));
    if (!getInventory['data']) throw new ApiError(404, 'Inventory not found');
    const branchId = getInventory['data'].invData?.branchId;

  if (!getUserPermissions) {
    const getBranchByManager = await staffService.getStaffByUserId(req.user._id);
    if (!getBranchByManager) throw new ApiError(403, 'You do not have permission to perform this action');

    if (!getBranchByManager?.branchId.equals(branchId))
      throw new ApiError(403, 'You do not have permission to perform this action');
  }
 
 
  const approve = InventoryService.updateInventoryStatus(new Types.ObjectId(req.params['id']), req.body.status);
  res.json(approve);
})