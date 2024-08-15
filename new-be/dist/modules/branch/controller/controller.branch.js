import { catchAsync } from "../../utils";
import { Types } from "mongoose";
import { branchService } from "..";
// export const createBranch = GeneralIndex.createOneFactory(BRANCH);
// export const getOneBranch = GeneralIndex.getOneFactory(BRANCH);
// export const updateBranch = GeneralIndex.updateOneFactory(BRANCH);
// export const deleteBranch = GeneralIndex.deleteOneFactory(BRANCH);
// export const getAllBranch = GeneralIndex.getAllFactory(BRANCH);
export const createBranch = catchAsync(async (req, res) => {
    let body = Object.assign(Object.assign({}, req.body), { createdBy: req.user._id });
    const newBranch = await branchService.createBranch(body);
    res.status(201).send(newBranch);
});
export const getOneBranch = catchAsync(async (req, res) => {
    const id = new Types.ObjectId(req.params["id"]);
    if (id === undefined) {
        // Handle the case when id is undefined, e.g., return an error response
        res.status(400).send("Invalid id");
        return;
    }
    const branch = await branchService.getBranchById(id);
    res.status(200).send(branch);
});
export const updateBranch = catchAsync(async (req, res) => {
    const id = new Types.ObjectId(req.params["id"]);
    if (id === undefined) {
        // Handle the case when id is undefined, e.g., return an error response
        res.status(400).send("Invalid id");
        return;
    }
    const body = Object.assign(Object.assign({}, req.body), { updatedBy: req.user._id });
    const updatedBranch = await branchService.updateBranch(body, id);
    res.status(200).send(updatedBranch);
});
export const deleteBranch = catchAsync(async (req, res) => {
    const id = new Types.ObjectId(req.params["id"]);
    if (id === undefined) {
        // Handle the case when id is undefined, e.g., return an error response
        res.status(400).send("Invalid id");
        return;
    }
    const deletedBranch = await branchService.deleteBranch(id);
    res.status(200).send(deletedBranch);
});
export const getAllBranch = catchAsync(async (req, res) => {
    const branches = await branchService.getAllBranch(req.query);
    res.status(200).send(branches);
});
export const getBranchByCode = catchAsync(async (req, res) => {
    const branchCode = req.params["id"];
    if (branchCode === undefined) {
        // Handle the case when branchCode is undefined, e.g., return an error response
        res.status(400).send("Invalid branchCode");
        return;
    }
    const branch = await branchService.getBranchByCode(branchCode);
    res.status(200).send(branch);
});
export const getBranchByName = catchAsync(async (req, res) => {
    const branchName = req.params["id"];
    if (branchName === undefined) {
        // Handle the case when branchName is undefined, e.g., return an error response
        res.status(400).send("Invalid branchName");
        return;
    }
    const branch = await branchService.getBranchByName(branchName);
    res.status(200).send(branch);
});
//# sourceMappingURL=controller.branch.js.map