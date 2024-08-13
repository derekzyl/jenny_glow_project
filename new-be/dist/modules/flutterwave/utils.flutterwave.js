var RaveUtils;
(function (RaveUtils) {
    function emptyCheck(value, message = 'Some error occurred') {
        if (!value || typeof value === 'undefined') {
            throw new Error(message);
        }
    }
    RaveUtils.emptyCheck = emptyCheck;
    function initDefaultValue(value, default_value) {
        return value !== undefined ? value : default_value;
    }
    RaveUtils.initDefaultValue = initDefaultValue;
})(RaveUtils || (RaveUtils = {}));
export default RaveUtils;
//# sourceMappingURL=utils.flutterwave.js.map