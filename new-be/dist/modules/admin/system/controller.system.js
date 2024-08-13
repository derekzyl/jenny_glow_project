import { CrudService } from '../../genCrud';
import { catchAsync } from '../../utils';
import httpStatus from 'http-status';
import { SYSTEMS } from './model.system';
export const createSystemController = catchAsync(async (req, res) => {
    const service = await CrudService.create({ exempt: '-_V', Model: SYSTEMS }, Object.assign({}, req.body), {});
    res.status(httpStatus.CREATED).json(service);
});
export const getSystemController = catchAsync(async (req, res) => {
    const service = await CrudService.getOne({ exempt: '-_V', Model: SYSTEMS }, { _id: req.params['id'] }, {});
    res.status(200).json(service);
});
export const getSystemsController = catchAsync(async (req, res) => {
    const service = await CrudService.getMany({ exempt: '-_V', Model: SYSTEMS }, req.query, {});
    res.status(200).json(service);
});
export const updateSystemController = catchAsync(async (req, res) => {
    const service = await CrudService.update({ exempt: '-_V', Model: SYSTEMS }, Object.assign({}, req.body), { _id: req.params['id'] });
    res.status(200).json(service);
});
export const deleteSystemController = catchAsync(async (req, res) => {
    const service = await CrudService.delete({ exempt: '-_V', Model: SYSTEMS }, { _id: req.params['id'] });
    res.status(200).json(service);
    return;
});
//# sourceMappingURL=controller.system.js.map