import { shipping } from '../countries_states';
import { ApiError } from "../../../errors";
import responseMessage from "../../../genCrud/responseMessage";
import { catchAsync } from "../../../utils";
import { CrudService } from "expressbolt";
import httpStatus from "http-status";
import { SHIPPING } from "./model.shipping";
export const fetchCountryAndState = async (request, response, next) => {
    const r = request.query;
    const { country, state } = r;
    try {
        const data = JSON.parse(JSON.stringify(shipping));
        const result = data
            .filter((dat) => country ? dat.name.toLowerCase() === country.toLowerCase() : dat)
            .filter((data) => data.states.some((states) => state ? states.name.toLowerCase() === state.toLowerCase() : states));
        const m = result.map((a) => {
            return {
                name: a.name,
                states: a.states.map((s) => {
                    return { name: s.name };
                }),
            };
        });
        response.status(httpStatus.OK).json(responseMessage({
            data: m,
            success_status: true,
            message: "fetched address successfully",
        }));
    }
    catch (error) {
        next(error);
    }
};
export const getOneShippingFee = async (request, response, next) => {
    try {
        const get_shipping_fee = await SHIPPING.findById(request.params["id"]);
        if (!get_shipping_fee)
            throw new ApiError(httpStatus.NOT_FOUND, "shipping fee for selected location not found");
        response.status(httpStatus.OK).json(responseMessage({
            data: { get_shipping_fee },
            success_status: true,
            message: "fetched address successfully",
        }));
    }
    catch (error) {
        next(error);
    }
};
export const addShippingFee = async (request, response, next) => {
    try {
        const { country, countryShippingFee, states, useCountryShippingFeeAsDefault, } = request.body;
        const findCountryInDb = await SHIPPING.findOne({
            country: country.toUpperCase(),
        });
        let create_country_shipping;
        if (!findCountryInDb) {
            if (useCountryShippingFeeAsDefault) {
                states.map((state) => (state.stateShippingFee = countryShippingFee));
            }
            create_country_shipping = SHIPPING.create({
                created_by: request.user.id,
                country,
                countryShippingFee,
                useCountryShippingFeeAsDefault,
                states,
            });
            if (!create_country_shipping) {
                throw new ApiError(httpStatus.NOT_IMPLEMENTED, "oops shipping fee not created");
            }
        }
        else {
            if (useCountryShippingFeeAsDefault) {
                states.map((state) => (state.stateShippingFee = countryShippingFee));
            }
            const update_shipping = await SHIPPING.updateOne({ country: findCountryInDb.country }, {
                $addToSet: {
                    states: { $each: states },
                },
                useCountryShippingFeeAsDefault,
                countryShippingFee,
            });
            if (!update_shipping)
                throw new ApiError(httpStatus.BAD_REQUEST, "sorry we couldn't update shipping either");
        }
        response.status(httpStatus.OK).json(responseMessage({
            data: create_country_shipping,
            success_status: true,
            message: "fetched address successfully",
        }));
    }
    catch (error) {
        next(error);
    }
};
export const updateStateShippingFee = catchAsync(async (request, response) => {
    const { stateShippingFee, state } = request.body;
    const id = request.params["id"];
    const findCountryInDb = await SHIPPING.findOne({ id });
    if (!findCountryInDb)
        throw new ApiError(httpStatus.NOT_FOUND, "shipping fee for selected location not found");
    const findState = findCountryInDb.states.find((st) => st.name === state);
    if (!findState)
        throw new ApiError(httpStatus.NOT_FOUND, "state not found");
    findState.stateShippingFee = stateShippingFee;
    findCountryInDb.save();
    response.status(httpStatus.OK).json(responseMessage({
        data: findCountryInDb,
        success_status: true,
        message: "fetched address successfully",
    }));
});
export const addStateShippingFee = catchAsync(async (request, response) => {
    const { stateShippingFee, state } = request.body;
    const id = request.params["id"];
    const findCountryInDb = await SHIPPING.findOne({ id });
    if (!findCountryInDb)
        throw new ApiError(httpStatus.NOT_FOUND, "shipping fee for selected location not found");
    const findState = findCountryInDb.states.find((st) => st.name === state);
    if (findState)
        throw new ApiError(httpStatus.BAD_REQUEST, "state already exist");
    findCountryInDb.states.push({ name: state, stateShippingFee });
    findCountryInDb.save();
    response.status(httpStatus.OK).json(responseMessage({
        data: findCountryInDb,
        success_status: true,
        message: "fetched address successfully",
    }));
});
export const updateShippingFee = catchAsync(async (request, response) => {
    const { countryShippingFee, states, useCountryShippingFeeAsDefault, } = request.body;
    const country = request.params["id"];
    await SHIPPING.updateOne({ country }, { $addToSet: { states: { $each: states } } });
    const findCountryInDb = await SHIPPING.findOne({ country });
    if (findCountryInDb) {
        if (useCountryShippingFeeAsDefault) {
            findCountryInDb === null || findCountryInDb === void 0 ? void 0 : findCountryInDb.states.map((state) => (state.stateShippingFee =
                countryShippingFee !== null && countryShippingFee !== void 0 ? countryShippingFee : findCountryInDb.countryShippingFee));
            findCountryInDb.useCountryShippingFeeAsDefault =
                useCountryShippingFeeAsDefault;
        }
        await findCountryInDb.save();
    }
    response.send(findCountryInDb);
});
export const deleteShippingFee = catchAsync(async (request, response) => {
    const d = await CrudService.delete({ modelData: { Model: SHIPPING, select: [] }, data: { _id: request.params["id"] } });
    response.status(200).json(d);
});
export const getAllShippingFee = catchAsync(async (request, response) => {
    // const { state, country }: { state: string; country: string } = request.body;
    const get_shipping_fee = await CrudService.getMany({
        modelData: { Model: SHIPPING, select: [] },
        query: request.query,
        filter: {}, populate: {}
    });
    response.status(httpStatus.OK).json(get_shipping_fee);
});
export function fetchCountres() {
    const countries = JSON.parse(JSON.stringify(shipping));
    return countries;
}
//# sourceMappingURL=controller.shipping.js.map