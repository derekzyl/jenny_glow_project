"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getManyProduct = exports.getOneProduct = exports.createProduct = void 0;
const crud_1 = require("../../general_factory/crud");
const model_product_1 = require("./model.product");
const createProduct = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    //todo: send the images to aws or cloudinary
    try {
        const body = request.body;
        const gotten_body = Object.assign(Object.assign({}, body), { created_by: request.user.id });
        const crud_product = new crud_1.Crud(request, response, next);
        crud_product.create({ model: model_product_1.PRODUCT, exempt: "" }, gotten_body, {
            name: gotten_body.name,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createProduct = createProduct;
const getOneProduct = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const crud_product = new crud_1.Crud(request, response, next);
    crud_product.getOne({ model: model_product_1.PRODUCT, exempt: "-__v" }, { id: request.params.id }, {});
});
exports.getOneProduct = getOneProduct;
const getManyProduct = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const crud_review = new crud_1.Crud(request, response, next);
    crud_review.getMany({ model: model_product_1.PRODUCT, exempt: "-__v -created_at -updated_at" }, request.query, {}, { model: "reviews" });
});
exports.getManyProduct = getManyProduct;
const updateProduct = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = request.body;
    const crud_review = new crud_1.Crud(request, response, next);
    crud_review.update({ model: model_product_1.PRODUCT, exempt: "-__v" }, { id: request.params.id }, Object.assign({}, body));
});
exports.updateProduct = updateProduct;
const deleteProduct = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const crud_review = new crud_1.Crud(request, response, next);
    crud_review.delete({ model: model_product_1.PRODUCT, exempt: "-__v" }, { id: request.params.id });
});
exports.deleteProduct = deleteProduct;
