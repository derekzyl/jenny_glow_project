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
exports.deleteVat = exports.updateVat = exports.getManyVat = exports.getOneVat = exports.createVat = void 0;
const crud_1 = require("../../../general_factory/crud");
const model_vat_1 = require("./model.vat");
const createVat = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = request.body;
        const gotten_body = Object.assign({}, body);
        const crud_vat = new crud_1.Crud(request, response, next);
        crud_vat.create({ model: model_vat_1.VAT, exempt: "" }, gotten_body, {
            name: gotten_body.name,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createVat = createVat;
const getOneVat = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const crud_vat = new crud_1.Crud(request, response, next);
    crud_vat.getOne({ model: model_vat_1.VAT, exempt: "-__v -created_at updated_at" }, { vat_name: request.params.id });
});
exports.getOneVat = getOneVat;
const getManyVat = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const crud_review = new crud_1.Crud(request, response, next);
    crud_review.getMany({ model: model_vat_1.VAT, exempt: "-__v -created_at -updated_at" }, request.query);
});
exports.getManyVat = getManyVat;
const updateVat = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = request.body;
    const crud_review = new crud_1.Crud(request, response, next);
    crud_review.update({ model: model_vat_1.VAT, exempt: "-__v" }, { vat_name: request.params.id }, Object.assign({}, body));
});
exports.updateVat = updateVat;
const deleteVat = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const crud_review = new crud_1.Crud(request, response, next);
    crud_review.delete({ model: model_vat_1.VAT, exempt: "-__v -created_at -updated_at" }, { vat_name: request.params.id });
});
exports.deleteVat = deleteVat;
