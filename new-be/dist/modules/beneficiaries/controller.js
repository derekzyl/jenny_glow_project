import responseMessage from '../genCrud/responseMessage';
import { catchAsync } from '../utils';
import { CrudService } from 'expressbolt';
import BENEFICIARY from './model';
export const createBeneficiariesController = catchAsync(async (req, res) => {
    const { body } = req;
    const checkIfCreated = await BENEFICIARY.isExists({ customer: body.customer, type: body.type, userId: req.user.id });
    if (!checkIfCreated)
        await CrudService.create({
            check: {},
            data: Object.assign({ userId: req.user.id }, body),
            modelData: { Model: BENEFICIARY, select: [] },
        });
    res.json(responseMessage({ data: 'beneficiary added', message: 'beneficiary added successfully', success_status: true }));
});
export const getManyBeneficiaryController = catchAsync(async (req, res) => {
    const { query } = req;
    const getMany = await CrudService.getMany({
        query,
        modelData: { Model: BENEFICIARY, select: [] },
        filter: {},
        populate: {},
    });
    res.json(getMany);
});
export const getManyBeneficiaryByUserIdController = catchAsync(async (req, res) => {
    const { query } = req;
    const getMany = await CrudService.getMany({
        query,
        modelData: { Model: BENEFICIARY, select: [] },
        filter: { userId: req.user.id },
        populate: {},
    });
    res.json(getMany);
});
export const getOneBeneficiaryByIdController = catchAsync(async (req, res) => {
    const { id } = req.params;
    const getOne = await CrudService.getOne({
        data: { _id: id },
        modelData: { Model: BENEFICIARY, select: [] },
        populate: {},
    });
    res.json(getOne);
});
export const deleteOneBeneficiaryByIdController = catchAsync(async (req, res) => {
    const { id } = req.params;
    const getOne = await CrudService.delete({
        data: { _id: id },
        modelData: { Model: BENEFICIARY, select: [] },
    });
    res.json(getOne);
});
//# sourceMappingURL=controller.js.map