import { roleServices } from '../../admin/Roles';
import { staffService } from '../../admin/staff';
import { ApiError } from '../../errors';
import { allPermissions } from '../../setting/roles';
import { catchAsync } from '../../utils';
import { GeneralStatus } from '../../utils/utils';
import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { stockTransferService } from '..';
export const createStockTransfer = catchAsync(async (req, res) => {
    const getUserPermissions = await roleServices.checkStaffPermission(req.user._id, [
        allPermissions.SuperAdmin,
        allPermissions.Admin,
    ]);
    if (!getUserPermissions) {
        // throw new ApiError(403, "You do not have permission to perform this action")
        const getUserBranch = await staffService.getStaffByUserId(req.user._id);
        if (!getUserBranch)
            throw new ApiError(403, 'You do not have permission to perform this action');
        if (!getUserBranch.branchId.equals(req.body.fromBranch))
            throw new ApiError(403, 'You do not have permission to perform this action');
    }
    const stockTransfer = await stockTransferService.createStockTransfer(Object.assign(Object.assign({}, req.body), { fromBranchStatus: true, createdBy: req.user._id }));
    res.status(httpStatus.CREATED).send(stockTransfer);
});
export const getOneStockTransfer = catchAsync(async (request, response) => {
    const getOne = await stockTransferService.getOneStockTransfer(new Types.ObjectId(request.params['id']));
    response.json(getOne);
});
export const getManyStockTransfer = catchAsync(async (request, response) => {
    const getUserPermissions = await roleServices.checkStaffPermission(request.user._id, [
        allPermissions.SuperAdmin,
        allPermissions.Admin,
    ]);
    let query = request.query;
    if (!getUserPermissions) {
        const getUserBranch = await staffService.getStaffByUserId(request.user._id);
        if (!getUserBranch)
            throw new ApiError(403, 'You do not have permission to perform this action');
        query.fromBranch = getUserBranch.branchId;
    }
    const getMany = await stockTransferService.getManyStockTransfer(query);
    response.json(getMany);
});
export const updateStockTransfer = catchAsync(async (req, res) => {
    const getStockTransfer = await stockTransferService.getOneStockTransfer(new Types.ObjectId(req.params['id']));
    if (!getStockTransfer['success'] || !getStockTransfer['data'])
        throw new ApiError(404, 'Stock Transfer not found');
    const getUserPermissions = await roleServices.checkStaffPermission(req.user._id, [
        allPermissions.SuperAdmin,
        allPermissions.Admin,
    ]);
    if (!getUserPermissions) {
        const getUserBranch = await staffService.getStaffByUserId(req.user._id);
        if (!getUserBranch)
            throw new ApiError(403, 'You do not have permission to perform this action');
        if (!getStockTransfer['data'].fromBranch.equals(getUserBranch.branchId) &&
            !getStockTransfer['data'].toBranch.equals(getUserBranch.branchId))
            throw new ApiError(403, 'You do not have permission to perform this action');
        if (getStockTransfer['data'].transferStatus === GeneralStatus.APPROVED)
            throw new ApiError(403, 'You do not have permission to perform this action');
        if (getStockTransfer['data'].fromBranch.equals(getUserBranch.branchId))
            delete req.body.toBranchStatus;
        if (getStockTransfer['data'].toBranch.equals(getUserBranch.branchId))
            delete req.body.fromBranchStatus;
        // throw new ApiError(403, "You do not have permission to perform this action")
    }
    const stockTransfer = await stockTransferService.updateStockTransfer(new Types.ObjectId(req.params['id']), req.body);
    res.json(stockTransfer);
});
export const acceptStockTransferByBranch = catchAsync(async (req, res) => {
    const getStockTransfer = await stockTransferService.getOneStockTransfer(new Types.ObjectId(req.params['id']));
    if (!getStockTransfer['success'] || !getStockTransfer['data'])
        throw new ApiError(404, 'Stock Transfer not found');
    const getUserPermissions = await roleServices.checkStaffPermission(req.user._id, [
        allPermissions.SuperAdmin,
        allPermissions.Admin,
    ]);
    if (!getUserPermissions) {
        const getUserBranch = await staffService.getStaffByUserId(req.user._id);
        if (!getUserBranch)
            throw new ApiError(403, 'You do not have permission to perform this action');
        if (!getStockTransfer['data'].toBranch.equals(getUserBranch.branchId))
            throw new ApiError(403, 'You do not have permission to perform this action');
    }
    const stockTransfer = await stockTransferService.acceptStockTransferByBranch(new Types.ObjectId(req.params['id']));
    res.json(stockTransfer);
});
export const updateStockTransferStatus = catchAsync(async (req, res) => {
    const getStockTransfer = await stockTransferService.getOneStockTransfer(new Types.ObjectId(req.params['id']));
    if (!getStockTransfer['success'] || !getStockTransfer['data'])
        throw new ApiError(404, 'Stock Transfer not found');
    const getUserPermissions = await roleServices.checkStaffPermission(req.user._id, [
        allPermissions.SuperAdmin,
        allPermissions.Admin,
    ]);
    if (!getUserPermissions) {
        throw new ApiError(403, 'You do not have permission to perform this action');
    }
    const stockTransfer = await stockTransferService.updateStockTransferStatus(new Types.ObjectId(req.params['id']), req.body);
    res.json(stockTransfer);
});
export const deleteStockTransfer = catchAsync(async (req, res) => {
    const getStockTransfer = await stockTransferService.getOneStockTransfer(new Types.ObjectId(req.params['id']));
    if (!getStockTransfer['success'] || !getStockTransfer['data'])
        throw new ApiError(404, 'Stock Transfer not found');
    const getUserPermissions = await roleServices.checkStaffPermission(req.user._id, [
        allPermissions.SuperAdmin,
        allPermissions.Admin,
    ]);
    if (!getUserPermissions) {
        throw new ApiError(403, 'You do not have permission to perform this action');
    }
    const stockTransfer = await stockTransferService.deleteStockTransfer(new Types.ObjectId(req.params['id']));
    res.json(stockTransfer);
});
//# sourceMappingURL=controller.stock_transfer.js.map