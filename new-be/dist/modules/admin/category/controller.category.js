import { catchAsync } from "../../utils";
import { CrudService } from "expressbolt";
import httpStatus from "http-status";
import { GeneralIndex } from "../../general_factory/index.factory";
import { CATEGORY } from "./models/category.model";
import { SUB_CATEGORY } from "./models/sub_category.model";
// export const createCategory = GeneralIndex.createOneFactory(CATEGORY);
export const createCategory = catchAsync(async (req, res) => {
    const newCategory = await CrudService.create({ check: { name: req.body.name }, data: Object.assign(Object.assign({}, req.body), { createdBy: req.user._id }), modelData: { Model: CATEGORY, select: ['-createdBy', '-updatedBy'] } });
    res.status(httpStatus.CREATED).send(newCategory);
});
export const adminGetOneCategory = GeneralIndex.getOneFactory(CATEGORY);
export const getOneCategory = catchAsync(async (req, res) => {
    const category = await CrudService.getOne({ modelData: { Model: CATEGORY, select: ['-createdBy', '-updatedBy'] }, data: { _id: req.params["id"] }, populate: {} });
    res.status(httpStatus.OK).send(category);
});
// export const updateCategory = GeneralIndex.updateOneFactory(CATEGORY);
export const updateCategory = catchAsync(async (req, res) => {
    const updatedCategory = await CrudService.update({ data: Object.assign(Object.assign({}, req.body), { updatedBy: req.user.id }), modelData: { Model: CATEGORY, select: ['-createdBy', '-updatedBy'] }, filter: { _id: req.params["id"] } });
    res.status(httpStatus.OK).send(updatedCategory);
});
export const deleteCategory = GeneralIndex.deleteOneFactory(CATEGORY);
export const adminGetAllCategory = GeneralIndex.getAllFactory(CATEGORY);
export const getAllCategory = catchAsync(async (req, res) => {
    const categories = await CrudService.getMany({ modelData: { Model: CATEGORY, select: ['-createdBy', '-updatedBy'] }, query: req.query, populate: {}, filter: {} });
    res.status(httpStatus.OK).send(categories);
});
// export const createSubCategory = GeneralIndex.createOneFactory(SUB_CATEGORY);
export const createSubCategory = catchAsync(async (req, res) => {
    const newSubCategory = await CrudService.create({ check: { name: req.body.name }, data: Object.assign(Object.assign({}, req.body), { createdBy: req.user._id }), modelData: { Model: SUB_CATEGORY, select: ['-createdBy', '-updatedBy'] } });
    res.status(httpStatus.CREATED).send(newSubCategory);
});
export const adminGetOneSubCategory = GeneralIndex.getOneFactory(SUB_CATEGORY);
export const getOneSubCategory = catchAsync(async (req, res) => {
    const subCategory = await CrudService.getOne({ modelData: { Model: SUB_CATEGORY, select: ['-createdBy', '-updatedBy'] }, data: { _id: req.params["id"] }, populate: {} });
    res.status(httpStatus.OK).send(subCategory);
});
export const updateSubCategory = catchAsync(async (req, res) => {
    const updatedSubCategory = await CrudService.update({ data: Object.assign(Object.assign({}, req.body), { updatedBy: req.user.id }), modelData: { Model: SUB_CATEGORY, select: ['-createdBy', '-updatedBy'] }, filter: { _id: req.params["id"] } });
    res.status(httpStatus.OK).send(updatedSubCategory);
});
export const deleteSubCategory = GeneralIndex.deleteOneFactory(SUB_CATEGORY);
export const adminGetAllSubCategory = GeneralIndex.getAllFactory(SUB_CATEGORY);
export const getAllSubCategory = catchAsync(async (req, res) => {
    const subCategories = await CrudService.getMany({ modelData: { Model: SUB_CATEGORY, select: ['-createdBy', '-updatedBy'] }, query: req.query, populate: { path: "category", fields: ['name', 'image', "id"] }, filter: {} });
    res.status(httpStatus.OK).send(subCategories);
});
//# sourceMappingURL=controller.category.js.map