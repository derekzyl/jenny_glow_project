import { ApiError } from "../../errors";
import { notificationService } from "../../notification";
import { allPermissions } from "../../setting/roles";
import { CrudService } from "expressbolt";
import { REVIEW } from "./model.review";
export async function createReview(review) {
    const createReview = await CrudService.create({
        modelData: {
            Model: REVIEW,
            select: [],
        },
        data: review,
        check: {},
    });
    return createReview;
}
export async function getOneReview(reviewId) {
    const review = await CrudService.getOne({
        modelData: {
            Model: REVIEW,
            select: [],
        },
        data: { id: reviewId },
        populate: {},
    });
    return review;
}
export async function getManyReview(query, filter = {}) {
    const review = await CrudService.getMany({
        modelData: {
            Model: REVIEW,
            select: [],
        },
        filter,
        populate: {},
        query,
    });
    return review;
}
export async function updateReview(reviewId, review) {
    const updateReview = await CrudService.update({
        modelData: {
            Model: REVIEW,
            select: [],
        },
        data: review,
        filter: { id: reviewId },
    });
    return updateReview;
}
export async function updateUserReview(reviewId, review, userId) {
    var _a;
    const getReview = await getOneReview(reviewId);
    if (getReview['data'] && !getReview['data'].userId.equals(userId)) {
        throw new ApiError(403, 'You are not authorized to update this review');
    }
    const updateReview = await CrudService.update({
        modelData: {
            Model: REVIEW,
            select: [],
        },
        data: Object.assign(Object.assign({}, review), { isReviewed: true }),
        filter: { id: reviewId },
    });
    await notificationService.sendNotificationToStaffs({
        title: 'Review Updated',
        body: `A review has been updated by a user with id ~${(_a = getReview['data']) === null || _a === void 0 ? void 0 : _a.id}~ kindly review and approve`,
        type: 'review',
        permissions: [allPermissions.Review.Manage]
    });
    return updateReview;
}
export async function deleteReview(reviewId) {
    const review = await CrudService.delete({
        modelData: {
            Model: REVIEW,
            select: [],
        },
        data: { id: reviewId },
    });
    return review;
}
export async function approveReview(reviewId) {
    const approveReview = await CrudService.update({
        modelData: {
            Model: REVIEW,
            select: [],
        },
        data: { isApproved: true },
        filter: { id: reviewId },
    });
    return approveReview;
}
//# sourceMappingURL=service.review.js.map