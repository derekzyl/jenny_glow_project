import { roleServices } from "@modules/admin/Roles";
import { staffService } from "@modules/admin/staff";
import { ApiError } from "@modules/errors";
import { allPermissions } from "@modules/setting/roles";
import { catchAsync } from "@modules/utils";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { Types } from "mongoose";
import { stockService } from "..";




export const createStock = catchAsync(async (req: Request, res: Response) => { 
    const getUserPermissions = await roleServices.checkStaffPermission(req.user._id, [
        allPermissions.SuperAdmin,
        allPermissions.Admin,
    ]);
    if (!getUserPermissions) {
        const getUserBranch = await staffService.getStaffByUserId(req.user._id);
        if (!getUserBranch) throw new ApiError(403, 'You do not have permission to perform this action');
    
        if (!getUserBranch.branchId.equals(req.body.branchId))
        throw new ApiError(403, 'You do not have permission to perform this action');
    }
    
    const stock = await stockService.createStock({
        ...req.body,
        createdBy: req.user._id,
    });
    res.status(httpStatus.CREATED).send(stock);
});

export const getOneStock = catchAsync(async (request: Request, response: Response) => {
    const getOne = await stockService.getStock(new Types.ObjectId(request.params['id']));
    response.json(getOne);
});

export const getManyStock = catchAsync(async (request: Request, response: Response) => {
    const getUserPermissions = await roleServices.checkStaffPermission(request.user._id, [
        allPermissions.SuperAdmin,
        allPermissions.Admin,
    ]);
    let query: any = request.query;

    if (!getUserPermissions) {
        const getUserBranch = await staffService.getStaffByUserId(request.user._id);
        if (!getUserBranch) throw new ApiError(403, 'You do not have permission to perform this action');

        query.branchId = getUserBranch.branchId;
    }

    const getMany = await stockService.getAllStock(query);
    response.json(getMany);
});

export const updateStock = catchAsync(async (req: Request, res: Response) => {
    const getStock = await stockService.getStock(new Types.ObjectId(req.params['id']));
    if (!getStock['success'] || !getStock['data']) throw new ApiError(404, 'Stock not found');

    const updateStock = await stockService.updateStock(new Types.ObjectId(req.params['id']), req.body);
    res.json(updateStock);
});

export const deleteStock = catchAsync(async (req: Request, res: Response) => {
    const getStock = await stockService.getStock(new Types.ObjectId(req.params['id']));
    if (!getStock['success'] || !getStock['data']) throw new ApiError(404, 'Stock not found');

    const deleteStock = await stockService.deleteStock(new Types.ObjectId(req.params['id']));
    res.json(deleteStock);
});

export const addToStock = catchAsync(async (req: Request, res: Response) => {
    const getUserPermissions = await roleServices.checkStaffPermission(req.user._id, [
        allPermissions.SuperAdmin,
        allPermissions.Admin,
    ]);
    if (!getUserPermissions) {
        const getUserBranch = await staffService.getStaffByUserId(req.user._id);
        if (!getUserBranch) throw new ApiError(403, 'You do not have permission to perform this action');
    
        if (!getUserBranch.branchId.equals(req.body.branchId))
        throw new ApiError(403, 'You do not have permission to perform this action');
    }

    const addToStock = await stockService.addToStock({
        ...req.body,
    });
    res.json(addToStock);
})

export const removeStock = catchAsync(async (req: Request, res: Response) => { 
    const getUserPermissions = await roleServices.checkStaffPermission(req.user._id, [
        allPermissions.SuperAdmin,
        allPermissions.Admin,
    ]);
    if (!getUserPermissions) {
        const getUserBranch = await staffService.getStaffByUserId(req.user._id);
        if (!getUserBranch) throw new ApiError(403, 'You do not have permission to perform this action');
    
        if (!getUserBranch.branchId.equals(req.body.branchId))
        throw new ApiError(403, 'You do not have permission to perform this action');
    }

    const removeStock = await stockService.removeStock({
        ...req.body,
    });
    res.json(removeStock);
})

export const getStockByProductIdAndBranchId = catchAsync(async (req: Request, res: Response) => {
    const getStock = await stockService.getStockFromProductIdAndBranchId(req.body.productId, req.body.branchId);
    res.json(getStock);
})