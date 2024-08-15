import { ApiError } from "@modules/errors";
import { imageDeleteHandler } from "@modules/utils/file_handler/files_handler";
import { Request, Response } from "express";
import { CrudService } from "expressbolt";
import httpStatus from "http-status";

import { catchAsync } from "@modules/utils";
import { BlogBodyI, BlogI } from "../interface_blog/interface.blog";
import { BLOG } from "./model.blog";

export const createBlog = catchAsync(async (
  request: Request,
  response: Response,
) => {

    const body: BlogBodyI = request.body;


    const gotten_body = {
      ...body,
      created_by: request.user.id,
    };

  const crud_blog = CrudService.create<BlogI>({
       modelData:  { Model: BLOG, select: [] },
      data:{ ...gotten_body,createdBy: request.user.id },
      check:{
        title: gotten_body.title,
      }
  }) 
  response.status(201).send(crud_blog)

  
  
});

export const getOneBlog = catchAsync(async (
  request: Request,
  response: Response,
) => {



  const crud_blog = await CrudService.getOne<BlogI>({
       modelData: { Model: BLOG, select:[ "-__v","-createdBy"] },
    data:{ _id: request.params['id'] },
    populate:{
      path: 'createdBy',
      fields: ['firstName','lastName'],
    },
  })   
  
response.send(crud_blog)
});

export const getManyBlog = async (
  request: Request,
  response: Response,
) => {


  const crud_blog =CrudService.getMany<BlogI>
    ({
      modelData:  { Model: BLOG, select: ["-__v",  "-createdBy"] },
    query:request.query,
    filter:{},

    populate:{}
  
    })
  response.send(crud_blog)
};

export const updateBlog = catchAsync(async (
  request: Request,
  response: Response,
) => {
  const body: BlogBodyI = request.body;
  if (body.image) {
    const get_blog = await BLOG.findById(request.params['id']);
    if (!get_blog) throw new ApiError(httpStatus.NOT_FOUND,"blog not found");
    get_blog.image ? imageDeleteHandler(get_blog.image) : "";
  }

  const crud_blog =  CrudService.update<BlogI>(
    {modelData:{ Model: BLOG, select: ["-__v"] },
     data:{ ...body },
     filter:{ _id: request.params['id'] }
    });
  response.send(crud_blog)
});
export const deleteBlog = catchAsync(async (
  request: Request,
  response: Response,
) => {
  const get_blog = await BLOG.findById(request.params['id']);
  if (!get_blog) throw new ApiError(httpStatus.NOT_FOUND,"blog not found");
  get_blog.image ? imageDeleteHandler(get_blog.image) : "";

  const crud_blog = CrudService.delete<BlogI>({
   modelData: { Model: BLOG, select: ["-__v"] },
    data:{ _id: request.params['id'] }}
  );
  response.send(crud_blog)
});
