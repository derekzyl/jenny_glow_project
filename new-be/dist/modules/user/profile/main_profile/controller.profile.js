import { PROFILE } from "./model.profile";
import { catchAsync } from "../../../utils";
import { CrudService } from "expressbolt";
import httpStatus from "http-status";
//todo profile receipt
export const createProfile = catchAsync(async (request, response) => {
    const profile = await CrudService.create({
        check: {},
        data: request.body,
        modelData: {
            Model: PROFILE, select: []
        }
    });
    response.status(httpStatus.CREATED).send(profile);
});
export const getOneProfileByUserId = catchAsync(async (request, response) => {
    const getProfile = await CrudService.getOne({
        data: { userId: request.user.id }, modelData: {
            Model: PROFILE, select: []
        }, populate: {
            path: 'userId',
            fields: ['-password']
        }
    });
    response.send(getProfile);
});
export const getOneProfileById = catchAsync(async (request, response) => {
    const getProfile = await CrudService.getOne({
        data: { id: request.params['id'] }, modelData: {
            Model: PROFILE, select: []
        }, populate: {
            path: 'userId',
            fields: ['-password']
        }
    });
    response.send(getProfile);
});
export const getManyProfile = catchAsync(async (request, response) => {
    const getMany = await CrudService.getMany({
        filter: {},
        query: request.query,
        modelData: {
            Model: PROFILE,
            select: []
        }, populate: {}
    });
    response.send(getMany);
});
export const updateProfileById = catchAsync(async (request, response) => {
    const body = request.body;
    const update = await CrudService.update({
        data: body,
        filter: { id: request.params['id'] },
        modelData: {
            Model: PROFILE, select: []
        }
    });
    response.send(update);
});
export const updateProfileByUserId = catchAsync(async (request, response) => {
    const body = request.body;
    const update = await CrudService.update({
        data: body,
        filter: { userId: request.user.id },
        modelData: {
            Model: PROFILE, select: []
        }
    });
    response.send(update);
});
export const deleteProfileById = catchAsync(async (request, response) => {
    const del = await CrudService.delete({
        data: { id: request.params['id'] }, modelData: {
            Model: PROFILE, select: []
        }
    });
    response.send(del);
});
export const deleteProfileByUserId = catchAsync(async (request, response) => {
    const del = await CrudService.delete({
        data: { userId: request.user.id }, modelData: {
            Model: PROFILE, select: []
        }
    });
    response.send(del);
});
//# sourceMappingURL=controller.profile.js.map