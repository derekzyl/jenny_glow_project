/* The `namespace BitPwrUtils {` is creating a namespace in TypeScript called `BitPwrUtils`. A
namespace is a way to organize code and prevent naming conflicts by encapsulating related code
within a named scope. In this case, the namespace `BitPwrUtils` is used to group together utility
functions related to BitPwr. */
var BitPwrUtils;
(function (BitPwrUtils) {
    /**
     * The function `emptyCheck` checks if a value is empty or undefined and throws an error with a
     * specified message if it is.
     * @param {any} value - The `value` parameter is the value that needs to be checked for emptiness. It
     * can be of any type.
     * @param {string} [message=Some error occurred] - The `message` parameter is a string that
     * represents the error message to be thrown if the `value` is empty or undefined. It is an optional
     * parameter with a default value of `'Some error occurred'`.
     */
    function emptyCheck(value, message = 'Some error occurred') {
        if (!value || typeof value === 'undefined') {
            throw new Error(message);
        }
    }
    BitPwrUtils.emptyCheck = emptyCheck;
    /**
     * The function `initDefaultValue` returns the value if it is not undefined, otherwise it returns the
     * default value.
     * @param {T | undefined} value - The `value` parameter is a variable of type `T` or `undefined`. It
     * represents the value that you want to check if it is defined or not.
     * @param {T} default_value - The `default_value` parameter is the value that will be returned if the
     * `value` parameter is `undefined`.
     * @returns the value if it is not undefined, otherwise it is returning the default value.
     */
    function initDefaultValue(value, default_value) {
        return value !== undefined ? value : default_value;
    }
    BitPwrUtils.initDefaultValue = initDefaultValue;
    /**
     * The function `getAuthenticationToken` takes a public key and a secret key, encodes them using
     * base64, and returns the encoded token.
     * @param {string} publicKey - The `publicKey` parameter is a string that represents the public key
     * used for authentication. It is typically a unique identifier associated with a user or
     * application.
     * @param {string} secretKey - The `secretKey` parameter is a string that represents a secret key
     * used for authentication. It is typically a unique and confidential value that is known only to
     * the authorized user or application.
     * @returns an encoded authentication token as a string.
     */
    function getAuthenticationToken(publicKey, secretKey) {
        let encodedToken = Buffer.from(`${publicKey}:${secretKey}`).toString('base64');
        return encodedToken;
    }
    BitPwrUtils.getAuthenticationToken = getAuthenticationToken;
})(BitPwrUtils || (BitPwrUtils = {}));
export default BitPwrUtils;
//# sourceMappingURL=utils.bitpwr.js.map