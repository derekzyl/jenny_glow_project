import { approveReview, createReview, deleteReview, getApprovedProductReviews, getManyReview, getOneReview, getPendingReviewByUser, getReviewByProduct, getUserReviews, updateReview, updateUserReview } from "./main_review/controller.review";
class Review {
    constructor() {
        this.create_review = createReview;
        this.get_one_review = getOneReview;
        this.get_all_review = getManyReview;
        this.update_review = updateReview;
        this.delete_review = deleteReview;
        this.approve_review = approveReview;
        this.get_approved_product_reviews = getApprovedProductReviews;
        this.update_user_review = updateUserReview;
        this.get_pending_review_by_user = getPendingReviewByUser;
        this.get_review_by_product = getReviewByProduct;
        this.get_user_reviews = getUserReviews;
    }
}
export const ReviewIndex = new Review();
//# sourceMappingURL=index.review.js.map