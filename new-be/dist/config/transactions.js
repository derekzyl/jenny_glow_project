export var fiatTransactionStatus;
(function (fiatTransactionStatus) {
    fiatTransactionStatus["pending"] = "PENDING";
    fiatTransactionStatus["successful"] = "SUCCESSFUL";
    fiatTransactionStatus["success"] = "SUCCESS";
    fiatTransactionStatus["failed"] = "FAILED";
    fiatTransactionStatus["error"] = "ERROR";
})(fiatTransactionStatus || (fiatTransactionStatus = {}));
export var orderTypes;
(function (orderTypes) {
    orderTypes["pending"] = "PENDING";
    orderTypes["successful"] = "SUCCESSFUL";
    orderTypes["failed"] = "FAILED";
    orderTypes["success"] = "SUCCESS";
    orderTypes["pending_"] = "pending";
    orderTypes["successful_"] = "successful";
    orderTypes["failed_"] = "failed";
    orderTypes["success_"] = "success";
})(orderTypes || (orderTypes = {}));
//# sourceMappingURL=transactions.js.map