import { NextFunction, Response, Request } from "express";
import { ReviewBodyI, ReviewI } from "../interface_review/interface.review";
import { Crud } from "../../general_factory/crud";
import { REVIEW } from "./model.review";

export const createReview = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const body: ReviewBodyI = request.body;
    const review_data = { ...body, user: request.user.id };

    const crud_review = new Crud(request, response, next);
    const created_review = crud_review.create(
      { model: REVIEW, exempt: "" },
      review_data,
      {
        user: request.user.id,
        product: body.product,
      }
    );
  } catch (error) {
    next(error);
  }
};

export const getOneReview = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const crud_review = new Crud(request, response, next);
  crud_review.getOne(
    { model: REVIEW, exempt: "-__v" },
    { id: request.params.id }
  );
};

export const getManyReview = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const crud_review = new Crud(request, response, next);
  crud_review.getMany(
    { model: REVIEW, exempt: "-__v -created_at -updated_at" },
    request.query
  );
};

export const updateReview = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const body = {
    rating: request.body.rating,
    comment: request.body.comment,
    updated_at: Date.now,
  };
  const crud_review = new Crud(request, response, next);
  crud_review.update(
    { model: REVIEW, exempt: "-__v" },
    { id: request.params.id },
    { ...body }
  );
};
export const deleteReview = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const crud_review = new Crud(request, response, next);
  crud_review.delete(
    { model: REVIEW, exempt: "-__v" },
    { id: request.params.id }
  );
};
