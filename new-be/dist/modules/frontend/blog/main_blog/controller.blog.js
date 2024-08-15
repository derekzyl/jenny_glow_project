import { ApiError } from "../../../errors";
import { imageDeleteHandler } from "../../../utils/file_handler/files_handler";
import { CrudService } from "expressbolt";
import httpStatus from "http-status";
import { catchAsync } from "../../../utils";
import { BLOG } from "./model.blog";
export const createBlog = catchAsync(async (request, response) => {
    const body = request.body;
    const gotten_body = Object.assign(Object.assign({}, body), { created_by: request.user.id });
    const crud_blog = CrudService.create({
        modelData: { Model: BLOG, select: [] },
        data: Object.assign(Object.assign({}, gotten_body), { createdBy: request.user.id }),
        check: {
            title: gotten_body.title,
        }
    });
    response.status(201).send(crud_blog);
});
export const getOneBlog = catchAsync(async (request, response) => {
    const crud_blog = await CrudService.getOne({
        modelData: { Model: BLOG, select: ["-__v", "-createdBy"] },
        data: { _id: request.params['id'] },
        populate: {
            path: 'createdBy',
            fields: ['firstName', 'lastName'],
        },
    });
    response.send(crud_blog);
});
export const getManyBlog = async (request, response) => {
    const crud_blog = CrudService.getMany({
        modelData: { Model: BLOG, select: ["-__v", "-createdBy"] },
        query: request.query,
        filter: {},
        populate: {}
    });
    response.send(crud_blog);
};
export const updateBlog = catchAsync(async (request, response) => {
    const body = request.body;
    if (body.image) {
        const get_blog = await BLOG.findById(request.params['id']);
        if (!get_blog)
            throw new ApiError(httpStatus.NOT_FOUND, "blog not found");
        get_blog.image ? imageDeleteHandler(get_blog.image) : "";
    }
    const crud_blog = CrudService.update({ modelData: { Model: BLOG, select: ["-__v"] },
        data: Object.assign({}, body),
        filter: { _id: request.params['id'] } });
    response.send(crud_blog);
});
export const deleteBlog = catchAsync(async (request, response) => {
    const get_blog = await BLOG.findById(request.params['id']);
    if (!get_blog)
        throw new ApiError(httpStatus.NOT_FOUND, "blog not found");
    get_blog.image ? imageDeleteHandler(get_blog.image) : "";
    const crud_blog = CrudService.delete({
        modelData: { Model: BLOG, select: ["-__v"] },
        data: { _id: request.params['id'] }
    });
    response.send(crud_blog);
});
//# sourceMappingURL=controller.blog.js.map