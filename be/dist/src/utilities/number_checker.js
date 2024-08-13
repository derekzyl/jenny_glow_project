"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.n = n;
const custom_error_1 = require("./custom_error");
function n(nr) {
    if (Number.isNaN(nr))
        throw (0, custom_error_1.APP_ERROR)("this not a number");
    return Number(Number(nr).toFixed(2));
}
