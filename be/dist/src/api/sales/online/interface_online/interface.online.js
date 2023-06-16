"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryStatusE = exports.MessageTypeE = void 0;
var MessageTypeE;
(function (MessageTypeE) {
    MessageTypeE["TEXT"] = "TEXT";
    MessageTypeE["URL"] = "URL";
    MessageTypeE["IMAGE"] = "IMAGE";
    MessageTypeE["VIDEO"] = "VIDEO";
})(MessageTypeE = exports.MessageTypeE || (exports.MessageTypeE = {}));
var DeliveryStatusE;
(function (DeliveryStatusE) {
    DeliveryStatusE["RECEIVED_BY_CUSTOMER"] = "RECEIVED_BY_CUSTOMER";
    DeliveryStatusE["DISPATCHED"] = "DISPATCHED";
    DeliveryStatusE["ON_TRANSIT"] = "ON_TRANSIT";
    DeliveryStatusE["PENDING"] = "PENDING";
})(DeliveryStatusE = exports.DeliveryStatusE || (exports.DeliveryStatusE = {}));
// export type OnlineBodyT = Pick<OnlineI,  "address"| ""  |||||||||    >
