import { catchAsync } from "../../utils";
import { Types } from "mongoose";
import { workingHoursService } from "..";
export const createWorkingHours = catchAsync(async (req, res) => {
    const body = req.body;
    const newWorkingHours = await workingHoursService.createWorkingHours(body);
    res.status(201).send(newWorkingHours);
});
export const getOneWorkingHours = catchAsync(async (req, res) => {
    const id = new Types.ObjectId(req.params["id"]);
    const workingHours = await workingHoursService.getWorkingHours(id);
    res.status(200).send(workingHours);
});
export const updateWorkingHours = catchAsync(async (req, res) => {
    const id = new Types.ObjectId(req.params["id"]);
    const body = Object.assign(Object.assign({}, req.body), { updatedBy: req.user._id });
    const updatedWorkingHours = await workingHoursService.updateWorkingHours(body, id);
    res.status(200).send(updatedWorkingHours);
});
export const deleteWorkingHours = catchAsync(async (req, res) => {
    const id = new Types.ObjectId(req.params["id"]);
    const deletedWorkingHours = await workingHoursService.deleteWorkingHours(id);
    res.status(200).send(deletedWorkingHours);
});
export const getAllWorkingHours = catchAsync(async (req, res) => {
    const workingHours = await workingHoursService.getAllWorkingHours(req.query);
    res.status(200).send(workingHours);
});
export const getWorkingHoursByBranch = catchAsync(async (req, res) => {
    const id = new Types.ObjectId(req.params["id"]);
    const workingHours = await workingHoursService.getWorkingHoursByBranch(id, req.query);
    res.status(200).send(workingHours);
});
//# sourceMappingURL=controller.hours.js.map