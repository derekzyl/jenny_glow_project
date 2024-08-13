"use strict";
exports.__esModule = true;
exports.changeUserPassword = exports.resetPin = exports.forgotPin = exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = exports.changePin = exports.createPin = exports.createUser = void 0;
var joi_1 = require("joi");
var validation_custom_1 = require("../validate/validation.custom");
var createUserBody = {
    email: joi_1["default"].string().required().email(),
    password: joi_1["default"].string().required().custom(validation_custom_1.password),
    firstName: joi_1["default"].string(),
    lastName: joi_1["default"].string(),
    role: joi_1["default"].string().required()
};
exports.createUser = {
    body: joi_1["default"].object().keys(createUserBody)
};
var createUserPin = {
    pin: joi_1["default"].string().required().custom(validation_custom_1.pin)
};
exports.createPin = {
    body: joi_1["default"].object().keys(createUserPin)
};
var changeUserPin = {
    pin: joi_1["default"].string().required().custom(validation_custom_1.pin),
    oldPin: joi_1["default"].string().required().custom(validation_custom_1.pin)
};
exports.changePin = {
    body: joi_1["default"].object().keys(changeUserPin)
};
exports.getUsers = {
    query: joi_1["default"].object().keys({
        firstName: joi_1["default"].string(),
        lastName: joi_1["default"].string(),
        email: joi_1["default"].string(),
        role: joi_1["default"].string(),
        sort: joi_1["default"].string(),
        projectBy: joi_1["default"].string(),
        limit: joi_1["default"].number().integer(),
        page: joi_1["default"].number().integer()
    })
};
exports.getUser = {
    params: joi_1["default"].object().keys({
        userId: joi_1["default"].string().custom(validation_custom_1.objectId)
    })
};
exports.updateUser = {
    params: joi_1["default"].object().keys({
        userId: joi_1["default"].required().custom(validation_custom_1.objectId)
    }),
    body: joi_1["default"].object()
        .keys({
        email: joi_1["default"].string().email(),
        password: joi_1["default"].string().custom(validation_custom_1.password),
        firstName: joi_1["default"].string(),
        lastName: joi_1["default"].string(),
        pin: joi_1["default"].string()
    })
        .min(1)
};
exports.deleteUser = {
    params: joi_1["default"].object().keys({
        userId: joi_1["default"].string().custom(validation_custom_1.objectId)
    })
};
exports.forgotPin = {
    body: joi_1["default"].object().keys({})
};
exports.resetPin = {
    query: joi_1["default"].object().keys({
        token: joi_1["default"].string().required()
    }),
    body: joi_1["default"].object().keys({
        pin: joi_1["default"].string().required().custom(validation_custom_1.pin)
    })
};
exports.changeUserPassword = {
    body: joi_1["default"].object().keys({
        password: joi_1["default"].string().required(),
        newPassword: joi_1["default"].string().required(),
        confirmNewPassword: joi_1["default"].string().required()
    })
};
