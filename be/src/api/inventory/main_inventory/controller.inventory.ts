import { NextFunction, Response, Request } from "express";

import { BRANCH_INVENTORY, INVENTORY } from "./model.inventory";
import { Crud } from "../../general_factory/crud";
import { generateId } from "../../../utilities/id_generator";
import { InventoryBodyI } from "../interface_inventory/interface.inventory";
import { PRODUCT } from "../../product/main_product/model.product";
import { APP_ERROR } from "../../../utilities/custom_error";
import { HTTP_RESPONSE } from "../../../utilities/http_response";

//todo inventory receipt
export const createInventory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const inventory_id = generateId();
    const inventory_receipt = "todo";
    const body: InventoryBodyI = request.body;
    const products = body.products;

    const inventory_body: InventoryBodyI = {
      inventory_id,
      products,
      inventory_receipt,
    };

    for (const product of products) {
      // add product count
      const get_product = await PRODUCT.findById(product.product.id);
      if (!get_product)
        throw APP_ERROR(
          "product not found in database",
          HTTP_RESPONSE.NOT_FOUND
        );
      get_product.number_in_stock =
        Number(get_product.number_in_stock) + Number(product.quantity);
      get_product.save();
    }

    const crud_inventory = new Crud(request, response, next);
    crud_inventory.create({ model: INVENTORY, exempt: "" }, inventory_body, {
      inventory_id: inventory_id,
    });
  } catch (error) {
    next(error);
  }
};

export const getOneInventory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const crud_inventory = new Crud(request, response, next);
  crud_inventory.getOne(
    { model: INVENTORY, exempt: "-__v " },
    { inventory_name: request.params.id },
    {}
  );
};

export const getManyInventory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const crud_review = new Crud(request, response, next);
  crud_review.getMany(
    { model: INVENTORY, exempt: "-__v " },
    request.query,
    {},
    {}
  );
};

export const updateInventory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const body = request.body;
  const crud_review = new Crud(request, response, next);
  crud_review.update(
    { model: INVENTORY, exempt: "-__v" },
    { inventory_name: request.params.id },
    { ...body }
  );
};
export const deleteInventory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const crud_review = new Crud(request, response, next);
  crud_review.delete(
    { model: INVENTORY, exempt: "-__v -created_at -updated_at" },
    { inventory_name: request.params.id }
  );
};

//todo inventory receipt
export const createBranchInventory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const inventory_id = generateId();
    const inventory_receipt = "todo";
    const body: InventoryBodyI = request.body;
    const products = body.products;

    const inventory_body: InventoryBodyI = {
      inventory_id,
      products,
      inventory_receipt,
    };

    for (const product of products) {
      // add product count
      const get_product = await PRODUCT.findById(product.product.id);
      if (!get_product)
        throw APP_ERROR(
          "product not found in database",
          HTTP_RESPONSE.NOT_FOUND
        );
      get_product.number_in_stock =
        Number(get_product.number_in_stock) + Number(product.quantity);
      get_product.save();
    }

    const crud_inventory = new Crud(request, response, next);
    crud_inventory.create(
      { model: BRANCH_INVENTORY, exempt: "" },
      inventory_body,
      {
        inventory_id: inventory_id,
      }
    );
  } catch (error) {
    next(error);
  }
};

export const getOneBranchInventory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const crud_inventory = new Crud(request, response, next);
  crud_inventory.getOne(
    { model: BRANCH_INVENTORY, exempt: "-__v " },
    { inventory_name: request.params.id },
    {}
  );
};

export const getManyBranchInventory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const crud_review = new Crud(request, response, next);
  crud_review.getMany(
    { model: BRANCH_INVENTORY, exempt: "-__v " },
    request.query,
    {},
    { model: "products" }
  );
};

export const updateBranchInventory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const body = request.body;
  const crud_review = new Crud(request, response, next);
  crud_review.update(
    { model: BRANCH_INVENTORY, exempt: "-__v" },
    { inventory_name: request.params.id },
    { ...body }
  );
};
export const deleteBranchInventory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const crud_review = new Crud(request, response, next);
  crud_review.delete(
    { model: BRANCH_INVENTORY, exempt: "-__v -created_at -updated_at" },
    { inventory_name: request.params.id }
  );
};
