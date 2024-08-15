import { catchAsync } from "../../utils";
import { Types } from "mongoose";
import * as reviewService from './service.review';
export const createReview = catchAsync(async (request, response) => {
    const createR = await reviewService.createReview(Object.assign(Object.assign({}, request.body), { userId: request.user.id }));
    response.status(201).send(createR);
});
export const getOneReview = catchAsync(async (request, response) => {
    const getOne = await reviewService.getOneReview(new Types.ObjectId(request.params["id"]));
    response.json(getOne);
});
export const getUserReviews = catchAsync(async (request, response) => {
    const getMany = await reviewService.getManyReview(request.query, { userId: request.user.id });
    response.json(getMany);
});
export const getManyReview = catchAsync(async (request, response) => {
    const getMany = await reviewService.getManyReview(request.query);
    response.json(getMany);
});
export const updateReview = catchAsync(async (request, response) => {
    const body = request.body;
    const updateReview = await reviewService.updateReview(new Types.ObjectId(request.params["id"]), body);
    response.json(updateReview);
});
export const updateUserReview = catchAsync(async (request, response) => {
    const body = request.body;
    const updateReview = await reviewService.updateUserReview(new Types.ObjectId(request.params["id"]), body, request.user.id);
    response.json(updateReview);
});
export const getApprovedProductReviews = catchAsync(async (request, response) => {
    const getMany = await reviewService.getManyReview(request.query, { product: request.params["id"], isApproved: true });
    response.json(getMany);
});
export const approveReview = catchAsync(async (request, response) => {
    const approveReview = await reviewService.approveReview(new Types.ObjectId(request.params["id"]));
    response.json(approveReview);
});
export const deleteReview = catchAsync(async (request, response) => {
    const deleteReview = await reviewService.deleteReview(new Types.ObjectId(request.params["id"]));
    response.json(deleteReview);
});
export const getReviewByProduct = catchAsync(async (request, response) => {
    const getMany = await reviewService.getManyReview(request.query, { product: request.params["id"] });
    response.json(getMany);
});
export const getPendingReviewByUser = catchAsync(async (request, response) => {
    const getMany = await reviewService.getManyReview(request.query, { userId: request.user.id, isReviewed: false });
    response.json(getMany);
});
//# sourceMappingURL=controller.review.js.map