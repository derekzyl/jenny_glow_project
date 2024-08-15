import { catchAsync } from "../../../utils";
import { CrudService } from "expressbolt";
import { VAT } from "./model.vat";
export const createVat = catchAsync(async (request, response) => {
    const body = request.body;
    const crud = await CrudService.create({
        check: {},
        data: body, modelData: {
            Model: VAT, select: []
        }
    });
    response.status(201).send(crud);
});
export const getOneVat = catchAsync(async (request, response) => {
    const getOne = CrudService.getOne({
        data: { id: request.params['id'] }, modelData: {
            Model: VAT,
            select: []
        }, populate: {}
    });
    response.send(getOne);
});
export const getManyVat = async (request, response) => {
    const getMany = CrudService.getMany({
        filter: {}, modelData: {
            Model: VAT, select: []
        }, populate: {}, query: request.query
    });
    response.send(getMany);
};
export const updateVat = catchAsync(async (request, response) => {
    const update = CrudService.update({
        data: request.body, filter: { id: request.params['id'] }, modelData: {
            Model: VAT, select: []
        }
    });
    response.send(update);
});
export const deleteVat = catchAsync(async (request, response) => {
    const delet = await CrudService.delete({
        data: { id: request.params['id'] }, modelData: {
            Model: VAT, select: []
        }
    });
    response.send(delet);
});
//# sourceMappingURL=controller.vat.js.map