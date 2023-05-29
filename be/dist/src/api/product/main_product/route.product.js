"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_auth_1 = require("../../auth/index.auth");
const index_product_1 = require("../index.product");
const productRouter = (0, express_1.Router)();
productRouter
    .route("/")
    .post(index_auth_1.AuthIndex.protector, index_product_1.ProductIndex.create_product)
    .get(index_auth_1.AuthIndex.protector, index_product_1.ProductIndex.get_all_product);
productRouter
    .route("/:id")
    .get(index_auth_1.AuthIndex.protector, index_product_1.ProductIndex.get_one_product)
    .patch(index_auth_1.AuthIndex.protector, index_product_1.ProductIndex.update_product)
    .delete(index_auth_1.AuthIndex.protector, index_product_1.ProductIndex.delete_product);
exports.default = productRouter;
