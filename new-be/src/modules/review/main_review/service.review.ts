import { ApiError } from "@modules/errors";
import { notificationService } from "@modules/notification";
import { allPermissions } from "@modules/setting/roles";
import { CrudService } from "expressbolt";
import { Types } from "mongoose";
import { ReviewBodyT, ReviewI } from "../interface_review/interface.review";
import { REVIEW } from "./model.review";


export async function createReview(review: ReviewI,) {
    const createReview = await CrudService.create<ReviewI>({
        modelData: {
            Model: REVIEW,
            select: [],
        },
        data: review,
        check: {},
    });


    return createReview;
}

export async function getOneReview (reviewId: Types.ObjectId) { 
    const review = await CrudService.getOne<ReviewI>({
        modelData: {
            Model: REVIEW,
            select: [],
        },
        data: { id: reviewId },
        populate: {},
    });

    return review;
}

export async function getManyReview(query: Record<string, any>, filter: Record<string, any>={}) {
    const review = await CrudService.getMany<ReviewI>({
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

export async function updateReview(reviewId: Types.ObjectId, review: ReviewBodyT) {
    const updateReview = await CrudService.update<ReviewI>({
        modelData: {
            Model: REVIEW,
            select: [],
        },
        data: review,
       filter:{id: reviewId},
    });

    return updateReview;
}

export async function updateUserReview(reviewId: Types.ObjectId, review: Omit<ReviewBodyT,'isApproved'|"isReviewed">, userId: Types.ObjectId) {
    const getReview = await getOneReview(reviewId);
    if (getReview['data'] && !getReview['data'].userId.equals(userId)) {
        throw new ApiError(403, 'You are not authorized to update this review');
    }
    
    const updateReview = await CrudService.update<ReviewI>({
        modelData: {
            Model: REVIEW,
            select: [],
        },
        data: {...review, isReviewed: true},
       filter:{id: reviewId},
    });


    await notificationService.sendNotificationToStaffs({
        title: 'Review Updated',
        body: `A review has been updated by a user with id ~${getReview['data']?.id}~ kindly review and approve`,
        type: 'review',
        permissions:[allPermissions.Review.Manage]
    })
    return updateReview;
}



export async function deleteReview(reviewId: Types.ObjectId) {
    const review = await CrudService.delete<ReviewI>({
        modelData: {
            Model: REVIEW,
            select: [],
        },
        data: { id: reviewId },
    });

    return review;
}

export async function approveReview (reviewId: Types.ObjectId) {
    const approveReview = await CrudService.update<ReviewI>({
        modelData: {
            Model: REVIEW,
            select: [],
        },
        data: { isApproved: true },
        filter: { id: reviewId },
    });

    return approveReview;
}