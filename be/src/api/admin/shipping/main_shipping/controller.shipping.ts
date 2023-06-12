import { NextFunction, Request, Response } from "express";
import address from "../countries_states.json";
import { APP_ERROR } from "../../../../utilities/custom_error";
import { HTTP_RESPONSE } from "../../../../utilities/http_response";
import { responseMessage } from "../../../../utilities/response_message";
import { Crud } from "../../../general_factory/crud";
import {
  ShippingBodyT,
  ShippingDocI,
} from "../interface_shipping/interface.shipping";
import { SHIPPING } from "./model.shipping";


export const fetchCountryAndState = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    response.status(HTTP_RESPONSE.OK).json(
      responseMessage({
        data: address,
        success_status: true,
        message: "fetched address successfully",
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getOneShippingFee = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { state, country }: { state: string; country: string } = request.body;

    const get_shipping_fee = await SHIPPING.findOne({
      country: country.toUpperCase(),
    });

    if (!get_shipping_fee)
      throw APP_ERROR("shipping fee for selected location not found");
    const find_state_fee = get_shipping_fee.states.filter(
      (sta) => sta.name === state
    );
    if (!find_state_fee) throw APP_ERROR("hey this is not found here at all");
    const shipping_fee = get_shipping_fee.use_country_shipping_fee_as_default
      ? get_shipping_fee.country_shipping_fee
      : find_state_fee;
    response.status(HTTP_RESPONSE.OK).json(
      responseMessage({
        data: { shipping_fee },
        success_status: true,
        message: "fetched address successfully",
      })
    );
  } catch (error) {
    next(error);
  }
};

export const addShippingFee = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const {
      country,
      country_shipping_fee,
      states,
      use_country_shipping_fee_as_default,
    }: ShippingBodyT = request.body;
    const find_country_in_db = await SHIPPING.findOne({
      country: country.toUpperCase(),
    });
    if (!find_country_in_db) {
      if (use_country_shipping_fee_as_default) {
        states.map(
          (state) => (state.state_shipping_fee = country_shipping_fee)
        );
      }
      const create_country_shipping = SHIPPING.create({
        created_by: request.user.id,
        country,
        country_shipping_fee,
        use_country_shipping_fee_as_default,
        states,
      });

      if (!create_country_shipping) {
        throw APP_ERROR("oops shipping fee not created");
      }
    } else {
      if (use_country_shipping_fee_as_default) {
        states.map(
          (state) => (state.state_shipping_fee = country_shipping_fee)
        );
      }
      const update_shipping = await SHIPPING.updateOne(
        { country: find_country_in_db.country },
        {
          $addToSet: {
            states: { $each: states },
          },
          use_country_shipping_fee_as_default,
          country_shipping_fee,
        }
      );
      if (!update_shipping)
        throw APP_ERROR("sorry we couldn't update shipping either");
    }
    response.status(HTTP_RESPONSE.OK).json(
      responseMessage({
        data: address,
        success_status: true,
        message: "fetched address successfully",
      })
    );
  } catch (error) {
    next(error);
  }
};

export const updateShippingFee = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const {
      country_shipping_fee,
      states,
      use_country_shipping_fee_as_default,
    }: Partial<ShippingBodyT> = request.body;
    const country = request.params.id;

    await SHIPPING.updateOne(
      { country },
      { $addToSet: { states: { $each: states } } }
    );
    const find_country_in_db = await SHIPPING.findOne({ country });
    if (find_country_in_db) {
      if (use_country_shipping_fee_as_default) {
        find_country_in_db?.states.map(
          (state) =>
            (state.state_shipping_fee =
              country_shipping_fee ?? find_country_in_db.country_shipping_fee)
        );
        find_country_in_db.use_country_shipping_fee_as_default =
          use_country_shipping_fee_as_default;
      }
      await find_country_in_db.save();
    }
  } catch (error) {
    next(error);
  }
};

export const deleteShippingFee = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const shipping_crud = new Crud(request, response, next);

    await shipping_crud.delete<ShippingDocI>(
      { model: SHIPPING, exempt: "" },
      {
        id: request.params.id,
      }
    );
  } catch (error) {
    next(error);
  }
};

export const getAllShippingFee = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { state, country }: { state: string; country: string } = request.body;

    const get_many_shipping_fee = new Crud(request, response, next);
    get_many_shipping_fee.getMany<ShippingBodyT>(
      { model: SHIPPING, exempt: "" },
      request.query,
      {},
      {}
    );
  } catch (error) {
    next(error);
  }
};
