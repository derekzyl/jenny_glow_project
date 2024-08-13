import Joi from 'joi';
const createBeneficiariesBody = {
    customer: Joi.string().required().example('the customer phone number code number etc'),
    type: Joi.string().required().valid('AIRTIME', 'DATA_BUNDLE', 'POWER', 'INTERNET', 'TOLL', 'CABLE', 'BANK'),
    billerName: Joi.string().example('GLO Nigeria'),
    accountName: Joi.string(),
    bankCode: Joi.string(),
    bankName: Joi.string(),
    billerCode: Joi.string(),
    billerNumber: Joi.string(),
    itemCode: Joi.string(),
};
export const createBeneficiaries = {
    body: Joi.object().keys(createBeneficiariesBody),
};
export const getBeneficiary = {
    params: Joi.object().keys({ id: Joi.string().required() }),
};
export const getManyBeneficiary = {
    query: Joi.object().keys({
        type: Joi.string().valid('AIRTIME', 'DATA_BUNDLE', 'POWER', 'INTERNET', 'TOLL', 'CABLE', 'BANK'),
        sort: Joi.string(),
        projectBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};
//# sourceMappingURL=validations.js.map