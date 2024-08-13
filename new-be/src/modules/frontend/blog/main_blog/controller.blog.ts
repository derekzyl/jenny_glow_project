import { ApiError } from "@modules/errors";
import { imageDeleteHandler } from "@modules/utils/file_handler/files_handler";
import { NextFunction, Request, Response } from "express";
import { CrudController } from "expressbolt";
import httpStatus from "http-status";
import { Crud } from "../../../general_factory/crud";
import { BlogBodyI, BlogDocI, BlogI } from "../interface_blog/interface.blog";
import { BLOG } from "./model.blog";

export const createBlog = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const body: BlogBodyI = request.body;


    const gotten_body = {
      ...body,
      created_by: request.user.id,
    };

    const crud_blog = new Crud(request, response, next);
    crud_blog.create<BlogI, BlogDocI>(
      { model: BLOG, exempt: "" },
      { ...gotten_body,createdBy: request.user.id },
      {
        title: gotten_body.title,
      }
    );
  } catch (error) {
    next(error);
  }
};

export const getOneBlog = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const crud_blog = new Crud(request, response, next);
  crud_blog.getOne<BlogDocI>(
    { model: BLOG, exempt: "-__v -created_by" },
    { _id: request.params['id'] },
    {}
  );
  const getBlog = new CrudController({ next, request, response, env: "production", });
  await getBlog.getOne<BlogI>({
    modelData: { Model: BLOG, select: [] },
    data: { _id: request.params['id'] },
    populate: {
      path: 'createdBy',
      fields: ['firstName','lastName'],
    },
  });
};

export const getManyBlog = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log("inside get many blogs");

  const crud_blog = new Crud(request, response, next);
  crud_blog.getMany<BlogDocI>(
    { model: BLOG, exempt: "-__v -created_at -updated_at -created_by" },
    request.query,
    {},

    {}
  );
};

export const updateBlog = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const body: BlogBodyI = request.body;
  if (body.image) {
    const get_blog = await BLOG.findById(request.params['id']);
    if (!get_blog) throw new ApiError(httpStatus.NOT_FOUND,"blog not found");
    get_blog.image ? imageDeleteHandler(get_blog.image) : "";
  }

  const crud_blog = new Crud(request, response, next);
  crud_blog.update<BlogBodyI, BlogDocI>(
    { model: BLOG, exempt: "-__v" },
    { ...body },
    { _id: request.params['id'] }
  );
};
export const deleteBlog = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const get_blog = await BLOG.findById(request.params['id']);
  if (!get_blog) throw new ApiError(httpStatus.NOT_FOUND,"blog not found");
  get_blog.image ? imageDeleteHandler(get_blog.image) : "";

  const crud_blog = new Crud(request, response, next);
  crud_blog.delete<BlogDocI>(
    { model: BLOG, exempt: "-__v" },
    { _id: request.params['id'] }
  );
};
