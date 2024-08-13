import { catchAsync } from "@modules/utils";
import { Request, Response } from "express";
import { Types } from "mongoose";
import { workingHoursService } from "..";
import { workingHoursI } from "../interface_branch/interface.branch";


export const createWorkingHours =catchAsync (async (req: Request, res: Response) => { 
    const body: workingHoursI = req.body;
    const newWorkingHours = await workingHoursService.createWorkingHours(body);
    res.status(201).send(newWorkingHours);
})

export const getOneWorkingHours = catchAsync(async (req: Request, res: Response) => {
    const id = new Types.ObjectId(req.params["id"])!;
    const workingHours = await workingHoursService.getWorkingHours(id);
    res.status(200).send(workingHours);
})

export const updateWorkingHours = catchAsync(async (req: Request, res: Response) => {
    const id = new Types.ObjectId(req.params["id"])!;
    const body: Omit<workingHoursI, 'createdBy'> & {
        updatedBy: Types.ObjectId
    } = {...req.body, updatedBy:req.user._id};
    const updatedWorkingHours = await workingHoursService.updateWorkingHours(body, id);
    res.status(200).send(updatedWorkingHours);
})

export const deleteWorkingHours = catchAsync(async (req: Request, res: Response) => {
    const id = new Types.ObjectId(req.params["id"])!;
    const deletedWorkingHours = await workingHoursService.deleteWorkingHours(id);
    res.status(200).send(deletedWorkingHours);
})

export const getAllWorkingHours = catchAsync(async (req: Request, res: Response) => {
    const workingHours = await workingHoursService.getAllWorkingHours(req.query);
    res.status(200).send(workingHours);
})

export const getWorkingHoursByBranch = catchAsync(async (req: Request, res: Response) => {
    const id = new Types.ObjectId(req.params["id"])!;
    const workingHours = await workingHoursService.getWorkingHoursByBranch(id, req.query);
    res.status(200).send(workingHours);
})