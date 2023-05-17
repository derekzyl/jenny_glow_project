"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewIndex = void 0;
const controller_review_1 = require("./main_review/controller.review");
class Review {
    constructor() {
        this.create_review = controller_review_1.createReview;
        this.get_one_review = controller_review_1.getOneReview;
        this.get_all_review = controller_review_1.getManyReview;
        this.update_review = controller_review_1.updateReview;
        this.delete_review = controller_review_1.deleteReview;
    }
}
exports.ReviewIndex = new Review();
