import { auth } from '@modules/auth';
import { allPermissions } from '@modules/setting/roles';
import { validate } from '@modules/validate';
import { Router } from 'express';
import * as reviewValidation from '../validation.review';
import * as reviewController from './controller.review';

const reviewRouter = Router();

// Create a new review
reviewRouter
  .route('/')
  .post(
    auth(), // Assuming the user needs to be authenticated to create a review
    validate(reviewValidation.createReview),
    reviewController.createReview
  )
  .get(validate(reviewValidation.getManyReview), reviewController.getManyReview);

// Get, update, or delete a single review by ID
reviewRouter
  .route('/:id')
  .get(validate(reviewValidation.getOneReview), reviewController.getOneReview)
  .patch(
    auth(allPermissions.Review.Update, allPermissions.Review.Manage), // Assuming the user needs to be authenticated to update a review
    validate(reviewValidation.updateReview),
    reviewController.updateReview
  )
  .delete(
    auth(allPermissions.Review.Delete, allPermissions.Review.Manage), // Assuming only authorized users can delete reviews
    validate(reviewValidation.deleteReview),
    reviewController.deleteReview
  );

// Approve a review (likely restricted to admins or staff)
reviewRouter
  .route('/:id/approve')
  .patch(auth(allPermissions.Review.Manage), validate(reviewValidation.approveReview), reviewController.approveReview);

// Get all reviews by a specific product and filter by approval status
reviewRouter
  .route('/product/:id')
  .get(validate(reviewValidation.getApprovedProductReviews), reviewController.getApprovedProductReviews);

// Get all pending reviews by a specific user
reviewRouter.route('/user/pending').get(
  auth(), // Assuming the user needs to be authenticated to view their pending reviews
  validate(reviewValidation.getPendingReviewByUser),
  reviewController.getPendingReviewByUser
);

reviewRouter.route('/user/review').patch(
  auth(), // Assuming the user needs to be authenticated to update their review
  validate(reviewValidation.updateUserReview),
  reviewController.updateUserReview
);


export { reviewRouter };
