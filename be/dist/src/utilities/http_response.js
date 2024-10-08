"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_RESPONSE = void 0;
var HTTP_RESPONSE;
(function (HTTP_RESPONSE) {
    HTTP_RESPONSE[HTTP_RESPONSE["CONTINUE"] = 100] = "CONTINUE";
    HTTP_RESPONSE[HTTP_RESPONSE["SWITCHING_PROTOCOLS"] = 101] = "SWITCHING_PROTOCOLS";
    HTTP_RESPONSE[HTTP_RESPONSE["OK"] = 200] = "OK";
    HTTP_RESPONSE[HTTP_RESPONSE["CREATED"] = 201] = "CREATED";
    HTTP_RESPONSE[HTTP_RESPONSE["NO_CONTENT"] = 204] = "NO_CONTENT";
    HTTP_RESPONSE[HTTP_RESPONSE["MOVED_PERMANENTLY"] = 301] = "MOVED_PERMANENTLY";
    HTTP_RESPONSE[HTTP_RESPONSE["FOUND"] = 302] = "FOUND";
    HTTP_RESPONSE[HTTP_RESPONSE["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
    HTTP_RESPONSE[HTTP_RESPONSE["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HTTP_RESPONSE[HTTP_RESPONSE["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HTTP_RESPONSE[HTTP_RESPONSE["FORBIDDEN"] = 403] = "FORBIDDEN";
    HTTP_RESPONSE[HTTP_RESPONSE["NOT_FOUND"] = 404] = "NOT_FOUND";
    HTTP_RESPONSE[HTTP_RESPONSE["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    HTTP_RESPONSE[HTTP_RESPONSE["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
    HTTP_RESPONSE[HTTP_RESPONSE["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
    HTTP_RESPONSE[HTTP_RESPONSE["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
})(HTTP_RESPONSE || (exports.HTTP_RESPONSE = HTTP_RESPONSE = {}));
