"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crud = void 0;
const custom_error_1 = require("../../utilities/custom_error");
const http_response_1 = require("../../utilities/http_response");
const query_1 = require("../../utilities/query");
const response_message_1 = require("../../utilities/response_message");
/**
 * Crud functionality
 *
 *
 */
class Crud {
    request;
    response;
    next;
    /**
     *
     * @param {Request} request express request object
     * @param {Response} response express response object
     * @param {NextFunction} next function
     */
    constructor(request, response, next) {
        this.request = request;
        this.response = response;
        this.next = next;
    }
    /**
     * Create a new request
     * ----------------------
     *
     *
     *  @summary please insert the literal value create <T>
     *
     * @method  create handles the creation
     * @param {CrudModelI} MyModel model object and whats its exempting when returning a response
     * @param {Record<string, any>} data request.body data object
     * @param {Record<string, any> }finder object searches the database for existing data then throws error if it does exist
     * @returns {Response | NextFunction}   a response message or passes errors to error center
     *
     * @example
     * // returns a response
     * create< T{ for the body}, U {for the model} >(MyModel, data, finder)
     */
    async create(MyModel, data, finder) {
        try {
            const find = await MyModel.model.findOne(finder);
            if (find)
                throw (0, custom_error_1.APP_ERROR)(`the ${MyModel} ${finder} already exist in database`, http_response_1.HTTP_RESPONSE.BAD_REQUEST);
            const create = new MyModel.model(data);
            const created = await create.save();
            if (!created)
                throw (0, custom_error_1.APP_ERROR)(`${finder} is not successfully created`, http_response_1.HTTP_RESPONSE.BAD_REQUEST);
            return this.response.status(http_response_1.HTTP_RESPONSE.CREATED).json((0, response_message_1.responseMessage)({
                success_status: true,
                data: created,
                message: "successfully created",
            }));
        }
        catch (error) {
            return this.next(error);
        }
    }
    /**
     * Update
     *
     * ---------
     *  @summary please insert the literal value update <T>
     *
     * @param {CrudModelI | CrudModelI[]} MyModel model object or an array of model object and whats its exempting when returning a response
     * @param {Record<string, any>} data this is the data to be used for updating the model
     * @param {Record<string, any>} filter this is used to find the document that need to be filtered
     * @returns
     *
     * @example
     * // returns a response
     * update< T{ for the body}, U{ for the model }>(MyModel, data<T>, filter<U>)
     */
    async update(MyModel, data, filter) {
        try {
            const dataF = [];
            if (Array.isArray(MyModel)) {
                MyModel.forEach(async (model) => {
                    const findAndUpdate = await model.model
                        .findOneAndUpdate(filter, data)
                        .select(model.exempt);
                    if (!findAndUpdate)
                        throw (0, custom_error_1.APP_ERROR)(`${data} not updated successfully`, http_response_1.HTTP_RESPONSE.NOT_IMPLEMENTED);
                    else {
                        dataF.push(findAndUpdate);
                    }
                });
            }
            else {
                const findAndUpdate = await MyModel.model
                    .findOneAndUpdate(filter, data)
                    .select(MyModel.exempt);
                if (!findAndUpdate)
                    throw (0, custom_error_1.APP_ERROR)(`${data} not updated successfully`);
                else {
                    dataF.push(findAndUpdate);
                }
            }
            return this.response.status(http_response_1.HTTP_RESPONSE.OK).json((0, response_message_1.responseMessage)({
                success_status: true,
                data: dataF,
                message: "successfully updated ",
            }));
        }
        catch (error) {
            return this.next(error);
        }
    }
    /**
     *
     * @param {CrudModelI} MyModels the model and exempt are the object data
     * @param {request.query} query
     * @param {Record<string, any> | null } category the first filter before any other filters
     * @param {Object} populate this takes the model field that needs to be populated
     *
     * ```ts
     * CrudModelI {
     * model: Model<any>;
     *exempt: string;
     *  }\
     *   populate: { model?: string | undefined; fields?: string | undefined } ```
     *
     * @example
     * // returns a response
     * getMany< T the model >(MyModel, query category<T>, populate: { model?: string | undefined; fields?: string | undefined)
     */
    async getMany(MyModels, query, category = null, populate) {
        try {
            let data;
            const all = [];
            if (Array.isArray(MyModels)) {
                MyModels.forEach(async (model) => {
                    let modelFind = model.model.find({ category });
                    if (model.exempt)
                        modelFind = modelFind.select(model.exempt);
                    if (populate.model)
                        modelFind = modelFind.populate(populate.model, populate.fields);
                    const queryf = new query_1.Queries(modelFind, query)
                        .filter()
                        .limitFields()
                        .paginate()
                        .sort();
                    const queryG = await queryf.model;
                    if (!queryG)
                        throw (0, custom_error_1.APP_ERROR)(`${model} is not successfully fetched`, http_response_1.HTTP_RESPONSE.NOT_FOUND);
                    data = all.push(queryG);
                });
            }
            else {
                let modelFind = MyModels.model.find({ category });
                if (MyModels.exempt)
                    modelFind = modelFind.select(MyModels.exempt);
                const queryf = new query_1.Queries(modelFind, query)
                    .filter()
                    .limitFields()
                    .sort()
                    .paginate();
                const queryG = await queryf.model;
                if (!queryG)
                    throw (0, custom_error_1.APP_ERROR)(`${MyModels} is not successfully created`, http_response_1.HTTP_RESPONSE.NOT_FOUND);
                data = queryG;
            }
            this.response.status(200).json((0, response_message_1.responseMessage)({
                success_status: true,
                message: "data fetched successfully",
                data: data,
            }));
        }
        catch (error) {
            this.next(error);
        }
    }
    /**
     *
     * @param {CrudModelI} MyModel -it takes a model and exempt field
     * @param {Object} data it takes the field that is used to mďthď up the data to be deleted
     * @example
     * // returns a response
     * delete< T the model >(MyModel,category<T>,)
     */
    async delete(MyModel, data) {
        try {
            if (Array.isArray(MyModel)) {
                MyModel.forEach(async (model) => {
                    const delet = await model.model.deleteOne(data);
                    if (!delet)
                        throw (0, custom_error_1.APP_ERROR)(`${model} is not successfully deleted`, http_response_1.HTTP_RESPONSE.NOT_IMPLEMENTED);
                });
            }
            else {
                const delet = await MyModel.model.deleteOne(data);
                if (!delet)
                    throw (0, custom_error_1.APP_ERROR)(`${MyModel} is not successfully deleted`, http_response_1.HTTP_RESPONSE.NOT_FOUND);
            }
            this.response.status(http_response_1.HTTP_RESPONSE.OK).json((0, response_message_1.responseMessage)({
                success_status: true,
                message: " deleted successfully",
                data: "deleted",
            }));
        }
        catch (error) {
            this.next(error);
        }
    }
    /**
     * Get One Crud Model
     *
     * -----------------
     *
     *
     * @param MyModel - it takes object as parameter {model, exempt}
     * @param data -data is the filter parameters and its an object  it takes `<key, value>`
     * @param populate - takes the model name and the fields from the you want to populate
     *
     * @example
     * ```ts
     * CrudModelI {
     * model: Model<any>;
     *exempt: string;
     *  }
     *   populate: { model?: string | undefined; fields?: string | undefined } ```
     *
     *   @example
     * // returns a response
     * getOne< T the model >(MyModel, category<T>, populate: { model?: string | undefined; fields?: string | undefined)})
     */
    async getOne(MyModel, data, populate) {
        try {
            const get_data = [];
            let get_one;
            if (Array.isArray(MyModel)) {
                MyModel.forEach(async (model) => {
                    get_one = await model.model.findOne(data).select(model.exempt);
                    if (populate.model)
                        if (populate.fields)
                            get_one = get_one.populate(populate.model, populate.fields);
                    if (!get_one)
                        throw (0, custom_error_1.APP_ERROR)(`${model} is not successfully fetched`, http_response_1.HTTP_RESPONSE.NOT_IMPLEMENTED);
                    get_data.push(get_one);
                });
            }
            else {
                get_one = await MyModel.model.findOne(data).select(MyModel.exempt);
                if (!get_one)
                    throw (0, custom_error_1.APP_ERROR)(`${MyModel} is not successfully fetched`, http_response_1.HTTP_RESPONSE.NOT_FOUND);
                if (populate.model)
                    if (populate.fields)
                        get_one = get_one.populate(populate.model, populate.fields);
                get_data.push(get_one);
            }
            this.response.status(http_response_1.HTTP_RESPONSE.OK).json((0, response_message_1.responseMessage)({
                success_status: true,
                message: " fetched successfully",
                data: get_one,
            }));
        }
        catch (error) {
            this.next(error);
        }
    }
}
exports.Crud = Crud;
