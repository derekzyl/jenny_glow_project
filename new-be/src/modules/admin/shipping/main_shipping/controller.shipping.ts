import { NextFunction, Request, Response } from "express";
import address from "../countries_states.json";



import { ApiError } from "@modules/errors";
import responseMessage from "@modules/genCrud/responseMessage";
import { catchAsync } from "@modules/utils";
import { CrudService } from "expressbolt";
import httpStatus from "http-status";
import {
  CountryI,
  LocationAddressT,
  ShippingBodyT,
  ShippingI
} from "../interface_shipping/interface.shipping";
import { SHIPPING } from "./model.shipping";

export const fetchCountryAndState = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const r: LocationAddressT = request.query;

  const { country, state } = r;
  try {
    const data: any[] = JSON.parse(JSON.stringify(address));
    const result = data
      .filter((dat) =>
        country ? dat.name.toLowerCase() === country.toLowerCase() : dat
      )
      .filter((data) =>
        data.states.some((states: any) =>
          state ? states.name.toLowerCase() === state.toLowerCase() : states
        )
      );
    const m = result.map((a: any) => {
      return {
        name: a.name,
        states: a.states.map((s: any) => {
          return { name: s.name };
        }),
      };
    });

    response.status(httpStatus.OK).json(
      responseMessage({
        data: m,
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
    const get_shipping_fee = await SHIPPING.findById(request.params["id"]);

    if (!get_shipping_fee)
      throw new ApiError(httpStatus.NOT_FOUND, "shipping fee for selected location not found");

    response.status(httpStatus.OK).json(
      responseMessage({
        data: { get_shipping_fee },
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
      countryShippingFee,
      states,
      useCountryShippingFeeAsDefault,
    }: ShippingBodyT = request.body;
    const findCountryInDb= await SHIPPING.findOne({
      country: country.toUpperCase(),
    });
    let create_country_shipping: any;
    if (!findCountryInDb) {
      if (useCountryShippingFeeAsDefault) {
        states.map(
          (state) => (state.stateShippingFee = countryShippingFee)
        );
      }
      create_country_shipping = SHIPPING.create({
        created_by: request.user.id,
        country,
        countryShippingFee,
        useCountryShippingFeeAsDefault,
        states,
      });

      if (!create_country_shipping) {
        throw new ApiError(httpStatus.NOT_IMPLEMENTED,"oops shipping fee not created");
      }
    } else {
      if (useCountryShippingFeeAsDefault) {
        states.map(
          (state) => (state.stateShippingFee = countryShippingFee)
        );
      }
      const update_shipping = await SHIPPING.updateOne(
        { country: findCountryInDb.country },
        {
          $addToSet: {
            states: { $each: states },
          },
          useCountryShippingFeeAsDefault,
          countryShippingFee,
        }
      );
      if (!update_shipping)
        throw new ApiError(httpStatus.BAD_REQUEST,"sorry we couldn't update shipping either");
    }
    response.status(httpStatus.OK).json(
      responseMessage({
        data: create_country_shipping,
        success_status: true,
        message: "fetched address successfully",
      })
    );
  } catch (error) {
    next(error);
  }
};

export const updateStateShippingFee = catchAsync(async (request: Request, response: Response,) => {
  const { stateShippingFee, state }: { stateShippingFee :number, state:string} = request.body;
  const id= request.params["id"];
  const findCountryInDb= await SHIPPING.findOne({ id });
  if (!findCountryInDb) throw new ApiError(httpStatus.NOT_FOUND, "shipping fee for selected location not found");
  const findState = findCountryInDb.states.find(
    (st) => st.name === state
  );
  if (!findState) throw new ApiError(httpStatus.NOT_FOUND, "state not found");
  findState.stateShippingFee = stateShippingFee;
  findCountryInDb.save();
  response.status(httpStatus.OK).json(
    responseMessage({
      data: findCountryInDb,
      success_status: true,
      message: "fetched address successfully",
    })
  );
 })

export const addStateShippingFee = catchAsync(async (request: Request, response: Response,) => {
  const { stateShippingFee, state }: { stateShippingFee :number, state:string} = request.body;
  const id= request.params["id"];
  const findCountryInDb = await SHIPPING.findOne({ id });
  if (!findCountryInDb) throw new ApiError(httpStatus.NOT_FOUND, "shipping fee for selected location not found");
  const findState = findCountryInDb.states.find(
    (st) => st.name === state
  );
  if (findState) throw new ApiError(httpStatus.BAD_REQUEST, "state already exist");
  findCountryInDb.states.push({ name: state, stateShippingFee });
  findCountryInDb.save();
  response.status(httpStatus.OK).json(
    responseMessage({
      data: findCountryInDb,
      success_status: true,
      message: "fetched address successfully",
    })
  );
}
)

export const updateShippingFee = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const {
      countryShippingFee,
      states,
      useCountryShippingFeeAsDefault,
    }: Partial<ShippingBodyT> = request.body;
    const country = request.params["id"];

    await SHIPPING.updateOne(
      { country },
      { $addToSet: { states: { $each: states } } }
    );
    const findCountryInDb= await SHIPPING.findOne({ country });
    if (findCountryInDb) {
      if (useCountryShippingFeeAsDefault) {
        findCountryInDb?.states.map(
          (state) =>
            (state.stateShippingFee =
              countryShippingFee ?? findCountryInDb.countryShippingFee)
        );
        findCountryInDb.useCountryShippingFeeAsDefault =
          useCountryShippingFeeAsDefault;
      }
      await findCountryInDb.save();
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
  
 await  CrudService.delete<ShippingI>({ modelData: { Model: SHIPPING, select:[] }, data: { _id: request.params["id"] } });
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
    // const { state, country }: { state: string; country: string } = request.body;

    const get_shipping_fee = await CrudService.getMany<ShippingI>({
      modelData: { Model: SHIPPING, select: [] },
      query: request.query,
      filter: {},populate:{}
    });

    response.status(httpStatus.OK).json(
      get_shipping_fee
    );
  } catch (error) {
    next(error);
  }
};



export function fetchCountres (): CountryI[] {
  const countries: CountryI[] = JSON.parse(JSON.stringify(address));
  return countries;
}