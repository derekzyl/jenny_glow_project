import { CrudService } from '../../genCrud';
import catchAsync from '../../utils/catchAsync';
import { walletCurrencyService } from '../../wallet';
import httpStatus from 'http-status';
import FXS from './model.fx';
export const createFxController = catchAsync(async (req, res) => {
    var _a, _b;
    const fxBody = req.body;
    const { user } = req;
    const currencyImage = await walletCurrencyService.tradableAssetsPlusIcons();
    const getImage = currencyImage === null || currencyImage === void 0 ? void 0 : currencyImage.find((e) => e.symbol && e.symbol.toUpperCase() === String(fxBody.currencyCode).toUpperCase());
    const response = await CrudService.create({ exempt: '-_v', Model: FXS }, {
        address: fxBody.address,
        currencyCode: fxBody.currencyCode,
        createdBy: user._id,
        updatedBy: user._id,
        image: (_a = getImage === null || getImage === void 0 ? void 0 : getImage.image) !== null && _a !== void 0 ? _a : '',
        currencyName: (_b = getImage === null || getImage === void 0 ? void 0 : getImage.name) !== null && _b !== void 0 ? _b : '',
        network: fxBody.network,
    }, { currencyCode: fxBody.currencyCode });
    if (response)
        res.status(httpStatus.CREATED).json(response);
});
/* The `deleteFxController` function is a controller function that handles the deletion of a fx
member. */
export const deleteFxByIdController = catchAsync(async (req, res) => {
    const { id } = req.params;
    const response = await CrudService.delete({ exempt: '-address', Model: FXS }, { _id: id });
    res.json(response);
});
export const getManyFxsController = catchAsync(async (req, res) => {
    const response = await CrudService.getMany({ exempt: '-__V', Model: FXS }, req.query, {}, {});
    res.json(response);
});
export const getOneFxByIdController = catchAsync(async (req, res) => {
    const { id } = req.params;
    const response = await CrudService.getOne({ exempt: '-__V', Model: FXS }, { _id: id }, {});
    res.json(response);
});
export const updateOneFxByIdController = catchAsync(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const { user } = req;
    const response = await CrudService.update({ exempt: '', Model: FXS }, Object.assign(Object.assign({}, data), { updatedBy: user.id }), { _id: id });
    res.json(response);
});
//# sourceMappingURL=controller.fx.js.map