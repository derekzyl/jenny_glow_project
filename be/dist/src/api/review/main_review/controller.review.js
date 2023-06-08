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
exports.deleteReview = exports.updateReview = exports.getManyReview = exports.getOneReview = exports.createReview = void 0;
const crud_1 = require("../../general_factory/crud");
const model_review_1 = require("./model.review");
const model_profile_1 = require("../../user/profile/main_profile/model.profile");
const custom_error_1 = require("../../../utilities/custom_error");
const http_response_1 = require("../../../utilities/http_response");
const createReview = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = request.body;
        const find_profile = yield model_profile_1.PROFILE.findOne({ user: request.user.id });
        if (!find_profile)
            throw (0, custom_error_1.APP_ERROR)("the profile isn't found", http_response_1.HTTP_RESPONSE.BAD_REQUEST);
        const review_data = Object.assign(Object.assign({}, body), { profile: find_profile.id });
        const crud_review = new crud_1.Crud(request, response, next);
        crud_review.create({ model: model_review_1.REVIEW, exempt: "" }, review_data, {
            user: request.user.id,
            product: body.product,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createReview = createReview;
const getOneReview = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const crud_review = new crud_1.Crud(request, response, next);
    crud_review.getOne({ model: model_review_1.REVIEW, exempt: "-__v" }, { id: request.params.id }, {});
});
exports.getOneReview = getOneReview;
const getManyReview = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const crud_review = new crud_1.Crud(request, response, next);
    crud_review.getMany({ model: model_review_1.REVIEW, exempt: "-__v -created_at -updated_at" }, request.query, {}, { model: "profile" });
});
exports.getManyReview = getManyReview;
const updateReview = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = {
        rating: request.body.rating,
        comment: request.body.comment,
        updated_at: Date.now,
    };
    const crud_review = new crud_1.Crud(request, response, next);
    crud_review.update({ model: model_review_1.REVIEW, exempt: "-__v" }, { id: request.params.id }, Object.assign({}, body));
});
exports.updateReview = updateReview;
const deleteReview = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const crud_review = new crud_1.Crud(request, response, next);
    crud_review.delete({ model: model_review_1.REVIEW, exempt: "-__v" }, { id: request.params.id });
});
exports.deleteReview = deleteReview;
