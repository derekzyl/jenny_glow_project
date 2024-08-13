import {
  approveReview,
  createReview,
  deleteReview,
  getApprovedProductReviews,
  getManyReview,
  getOneReview,
  getPendingReviewByUser,
  getReviewByProduct,
  getUserReviews,
  updateReview,
  updateUserReview
} from "./main_review/controller.review";

class Review {
  public create_review = createReview;
  public get_one_review = getOneReview;
  public get_all_review = getManyReview;
  public update_review = updateReview;
  public delete_review = deleteReview;
  public approve_review = approveReview;
  public get_approved_product_reviews = getApprovedProductReviews;
  public update_user_review = updateUserReview;
  public get_pending_review_by_user = getPendingReviewByUser;
  public get_review_by_product = getReviewByProduct;
  public get_user_reviews = getUserReviews;
  
}
export const ReviewIndex = new Review();
