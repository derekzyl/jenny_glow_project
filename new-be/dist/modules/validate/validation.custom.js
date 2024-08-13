export const objectId = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        return helpers.message({ custom: '"{{#label}}" must be a valid mongo id' });
    }
    return value;
};
export const password = (value, helpers) => {
    if (value.length < 8) {
        return helpers.message({ custom: 'password must be at least 8 characters' });
    }
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        return helpers.message({ custom: 'password must contain at least 1 letter and 1 number' });
    }
    return value;
};
export const pin = (value, helpers) => {
    if (value.length !== 6) {
        return helpers.message({ custom: 'pin must be 6 digits' });
    }
    if (!value.match(/^\d{6}$/)) {
        return helpers.message({ custom: 'pin must be a 6-digit number' });
    }
    return value;
};
//# sourceMappingURL=validation.custom.js.map