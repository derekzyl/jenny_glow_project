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
exports.deleteBranchInventory = exports.updateBranchInventory = exports.getManyBranchInventory = exports.getOneBranchInventory = exports.createBranchInventory = exports.deleteInventory = exports.updateInventory = exports.getManyInventory = exports.getOneInventory = exports.createInventory = void 0;
const model_inventory_1 = require("./model.inventory");
const crud_1 = require("../../general_factory/crud");
const id_generator_1 = require("../../../utilities/id_generator");
const model_product_1 = require("../../product/main_product/model.product");
const custom_error_1 = require("../../../utilities/custom_error");
const http_response_1 = require("../../../utilities/http_response");
//todo inventory receipt
const createInventory = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inventory_id = (0, id_generator_1.generateId)();
        const inventory_receipt = "todo";
        const body = request.body;
        const products = body.products;
        const inventory_body = {
            inventory_id,
            products,
            inventory_receipt,
        };
        for (const product of products) {
            // add product count
            const get_product = yield model_product_1.PRODUCT.findById(product.product.id);
            if (!get_product)
                throw (0, custom_error_1.APP_ERROR)("product not found in database", http_response_1.HTTP_RESPONSE.NOT_FOUND);
            get_product.number_in_stock =
                Number(get_product.number_in_stock) + Number(product.quantity);
            get_product.save();
        }
        const crud_inventory = new crud_1.Crud(request, response, next);
        crud_inventory.create({ model: model_inventory_1.INVENTORY, exempt: "" }, inventory_body, {
            inventory_id: inventory_id,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createInventory = createInventory;
const getOneInventory = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const crud_inventory = new crud_1.Crud(request, response, next);
    crud_inventory.getOne({ model: model_inventory_1.INVENTORY, exempt: "-__v " }, { inventory_name: request.params.id }, {});
});
exports.getOneInventory = getOneInventory;
const getManyInventory = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const crud_review = new crud_1.Crud(request, response, next);
    crud_review.getMany({ model: model_inventory_1.INVENTORY, exempt: "-__v " }, request.query, {}, {});
});
exports.getManyInventory = getManyInventory;
const updateInventory = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = request.body;
    const crud_review = new crud_1.Crud(request, response, next);
    crud_review.update({ model: model_inventory_1.INVENTORY, exempt: "-__v" }, { inventory_name: request.params.id }, Object.assign({}, body));
});
exports.updateInventory = updateInventory;
const deleteInventory = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const crud_review = new crud_1.Crud(request, response, next);
    crud_review.delete({ model: model_inventory_1.INVENTORY, exempt: "-__v -created_at -updated_at" }, { inventory_name: request.params.id });
});
exports.deleteInventory = deleteInventory;
//todo inventory receipt
const createBranchInventory = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inventory_id = (0, id_generator_1.generateId)();
        const inventory_receipt = "todo";
        const body = request.body;
        const products = body.products;
        const inventory_body = {
            inventory_id,
            products,
            inventory_receipt,
        };
        for (const product of products) {
            // add product count
            const get_product = yield model_product_1.PRODUCT.findById(product.product.id);
            if (!get_product)
                throw (0, custom_error_1.APP_ERROR)("product not found in database", http_response_1.HTTP_RESPONSE.NOT_FOUND);
            get_product.number_in_stock =
                Number(get_product.number_in_stock) + Number(product.quantity);
            get_product.save();
        }
        const crud_inventory = new crud_1.Crud(request, response, next);
        crud_inventory.create({ model: model_inventory_1.BRANCH_INVENTORY, exempt: "" }, inventory_body, {
            inventory_id: inventory_id,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createBranchInventory = createBranchInventory;
const getOneBranchInventory = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const crud_inventory = new crud_1.Crud(request, response, next);
    crud_inventory.getOne({ model: model_inventory_1.BRANCH_INVENTORY, exempt: "-__v " }, { inventory_name: request.params.id }, {});
});
exports.getOneBranchInventory = getOneBranchInventory;
const getManyBranchInventory = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const crud_review = new crud_1.Crud(request, response, next);
    crud_review.getMany({ model: model_inventory_1.BRANCH_INVENTORY, exempt: "-__v " }, request.query, {}, { model: "products" });
});
exports.getManyBranchInventory = getManyBranchInventory;
const updateBranchInventory = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = request.body;
    const crud_review = new crud_1.Crud(request, response, next);
    crud_review.update({ model: model_inventory_1.BRANCH_INVENTORY, exempt: "-__v" }, { inventory_name: request.params.id }, Object.assign({}, body));
});
exports.updateBranchInventory = updateBranchInventory;
const deleteBranchInventory = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const crud_review = new crud_1.Crud(request, response, next);
    crud_review.delete({ model: model_inventory_1.BRANCH_INVENTORY, exempt: "-__v -created_at -updated_at" }, { inventory_name: request.params.id });
});
exports.deleteBranchInventory = deleteBranchInventory;
