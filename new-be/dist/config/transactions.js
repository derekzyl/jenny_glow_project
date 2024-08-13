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
export var transactionTypes;
(function (transactionTypes) {
    transactionTypes["fiatDeposit"] = "FIAT_DEPOSIT";
    transactionTypes["buy"] = "BUY";
    transactionTypes["sell"] = "SELL";
    transactionTypes["swap"] = "SWAP";
    transactionTypes["electricity"] = "ELECTRICITY";
    transactionTypes["createAccount"] = "CREATE_ACCOUNT";
    transactionTypes["fiatTransfer"] = "FIAT_TRANSFER";
    transactionTypes["cryptoTransfer"] = "CRYPTO_TRANSFER";
    transactionTypes["cryptoDeposit"] = "CRYPTO_DEPOSIT";
    transactionTypes["airtime"] = "AIRTIME";
})(transactionTypes || (transactionTypes = {}));
//# sourceMappingURL=transactions.js.map