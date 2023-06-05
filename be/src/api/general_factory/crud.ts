import { NextFunction, Response, Request } from "express";

import { APP_ERROR } from "../../utilities/custom_error";
import { HTTP_RESPONSE } from "../../utilities/http_response";
import { Queries } from "../../utilities/query";
import { responseMessage } from "../../utilities/response_message";
import { CrudModelI } from "./interface/general_factory";
import { AddressModelI } from "../user/address/interface_address/interface.address";

/**
 * Crud functionality
 *
 *
 */
export class Crud {
  request: Request;
  response: Response;
  next: NextFunction;
  /**
   *
   * @param {Request} request express request object
   * @param {Response} response express response object
   * @param {NextFunction} next function
   */
  constructor(request: Request, response: Response, next: NextFunction) {
    this.request = request;
    this.response = response;
    this.next = next;
  }
  /**
   * Create a new request
   * ----------------------
   * @method  create handles the creation
   * @param {CrudModelI} MyModel model object and whats its exempting when returning a response
   * @param {Record<string, any>} data request.body data object
   * @param {Record<string, any> }finder object searches the database for existing data then throws error if it does exist
   * @returns {Response | NextFunction}   a response message or passes errors to error center
   *
   * @example
   * // returns a response
   * create(MyModel, data, finder)
   */
  async create(
    MyModel: CrudModelI,
    data: Record<string, any>,
    finder: Record<string, any>
  ): Promise<Response | NextFunction | void> {
    try {
      const find = await MyModel.model.findOne(finder);
      if (find)
        throw APP_ERROR(
          `the ${MyModel} ${finder} already exist in database`,
          HTTP_RESPONSE.BAD_REQUEST
        );

      const create = new MyModel.model(data);
      const created = await create.save();

      if (!created)
        throw APP_ERROR(
          `${finder} is not successfully created`,
          HTTP_RESPONSE.BAD_REQUEST
        );
      return this.response.status(HTTP_RESPONSE.CREATED).json(
        responseMessage({
          success_status: true,
          data: created,
          message: "successfully created",
        })
      );
    } catch (error) {
      return this.next(error);
    }
  }
  /**
   *
   * @param {CrudModelI | CrudModelI[]} MyModel model object or an array of model object and whats its exempting when returning a response
   * @param {Record<string, any>} data this is the data to be used for updating the model
   * @param {Record<string, any>} filter this is used to find the document that need to be filtered
   * @returns
   */
  async update(
    MyModel: CrudModelI | CrudModelI[],
    data: Record<string, any>,
    filter: Record<string, any>
  ) {
    try {
      const dataF: Array<any> = [];

      if (Array.isArray(MyModel)) {
        MyModel.forEach(async (model: CrudModelI) => {
          const findAndUpdate = await model.model
            .findOneAndUpdate(filter, data)
            .select(model.exempt);
          if (!findAndUpdate)
            throw APP_ERROR(
              `${data} not updated successfully`,
              HTTP_RESPONSE.NOT_IMPLEMENTED
            );
          else {
            dataF.push(findAndUpdate);
          }
        });
      } else {
        const findAndUpdate = await MyModel.model
          .findOneAndUpdate(filter, data)
          .select(MyModel.exempt);
        if (!findAndUpdate) throw APP_ERROR(`${data} not updated successfully`);
        else {
          dataF.push(findAndUpdate);
        }
      }

      return this.response.status(HTTP_RESPONSE.OK).json(
        responseMessage({
          success_status: true,
          data: dataF,
          message: "successfully updated ",
        })
      );
    } catch (error) {
      return this.next(error);
    }
  }
  /**
   *
   * @param {CrudModelI} MyModels the model and exempt are the object data
   * @param {request.query} query
   * @param {Record<string, any> | null } category the first filter before any other filters
   * @param {Object} populate this takes the model field that needs to be populated
   */
  async getMany(
    MyModels: CrudModelI | CrudModelI[],
    query: typeof this.request.query,
    category: Record<string, any> | null = null,
    populate: { model: string | undefined; fields?: string | undefined }
  ) {
    try {
      let data: any;
      const all = [];
      if (Array.isArray(MyModels)) {
        MyModels.forEach(async (model: CrudModelI) => {
          let modelFind = model.model.find({ category });
          if (model.exempt) modelFind = modelFind.select(model.exempt);
          if (populate.model)
            modelFind = modelFind.populate(populate.model, populate.fields);

          const queryf = new Queries(modelFind, query)
            .filter()
            .limitFields()
            .paginate()
            .sort();
          const queryG = await queryf.model;
          if (!queryG)
            throw APP_ERROR(
              `${model} is not successfully fetched`,
              HTTP_RESPONSE.NOT_FOUND
            );
          data = all.push(queryG);
        });
      } else {
        let modelFind = MyModels.model.find({ category });
        if (MyModels.exempt) modelFind = modelFind.select(MyModels.exempt);

        const queryf = new Queries(modelFind, query);
        const queryG = await queryf.model;
        if (!queryG)
          throw APP_ERROR(
            `${MyModels} is not successfully created`,
            HTTP_RESPONSE.NOT_FOUND
          );
        data = queryG;
      }
      this.response.status(200).json(
        responseMessage({
          success_status: true,
          message: "data fetched successfully",
          data: data,
        })
      );
    } catch (error) {
      this.next(error);
    }
  }
  /**
   *
   * @param MyModel
   * @param data
   */
  async delete(MyModel: CrudModelI | CrudModelI[], data: any) {
    try {
      if (Array.isArray(MyModel)) {
        MyModel.forEach(async (model: CrudModelI) => {
          const delet = await model.model.deleteOne(data);
          if (!delet)
            throw APP_ERROR(
              `${model} is not successfully deleted`,
              HTTP_RESPONSE.NOT_IMPLEMENTED
            );
        });
      } else {
        const delet = await MyModel.model.deleteOne(data);
        if (!delet)
          throw APP_ERROR(
            `${MyModel} is not successfully deleted`,
            HTTP_RESPONSE.NOT_FOUND
          );
      }

      this.response.status(HTTP_RESPONSE.OK).json(
        responseMessage({
          success_status: true,
          message: " deleted successfully",
          data: "deleted",
        })
      );
    } catch (error) {
      this.next(error);
    }
  }

  /**
   *
   * @param MyModel
   * @param data
   */
  async getOne(MyModel: CrudModelI | CrudModelI[], data: any) {
    try {
      let get_one: any = [];
      if (Array.isArray(MyModel)) {
        MyModel.forEach(async (model: CrudModelI) => {
          get_one = await model.model.findOne(data).select(model.exempt);
          if (!get_one)
            throw APP_ERROR(
              `${model} is not successfully fetched`,
              HTTP_RESPONSE.NOT_IMPLEMENTED
            );
        });
      } else {
        get_one.push(await MyModel.model.findOne(data).select(MyModel.exempt));
        if (!get_one)
          throw APP_ERROR(
            `${MyModel} is not successfully fetched`,
            HTTP_RESPONSE.NOT_FOUND
          );
      }

      this.response.status(HTTP_RESPONSE.OK).json(
        responseMessage({
          success_status: true,
          message: " fetched successfully",
          data: get_one,
        })
      );
    } catch (error) {
      this.next(error);
    }
  }
}
