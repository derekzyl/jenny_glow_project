"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseMessage = void 0;
function responseMessage(message, success_status, data) {
    switch (success_status) {
        case success_status === true:
            return {
                message,
                data,
                success_status,
            };
        case success_status === false:
            return {
                message,
                error: data,
                success_status,
            };
        default:
            break;
    }
}
exports.responseMessage = responseMessage;
