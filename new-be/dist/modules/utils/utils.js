export var GeneralStatus;
(function (GeneralStatus) {
    GeneralStatus["PENDING"] = "PENDING";
    GeneralStatus["APPROVED"] = "APPROVED";
    GeneralStatus["REJECTED"] = "REJECTED";
    GeneralStatus["CANCELLED"] = "CANCELLED";
})(GeneralStatus || (GeneralStatus = {}));
export function phoneRegex(phone) {
    const regExp = /^\+?[1-9]\d{1,14}$/;
    return regExp.test(phone);
}
export const regexPhone = /^\+?[1-9]\d{1,14}$/;
//# sourceMappingURL=utils.js.map