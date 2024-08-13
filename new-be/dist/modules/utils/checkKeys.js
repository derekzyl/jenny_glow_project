/**
 * The function `checkKeys` checks if an object has all the specified keys.
 *
 * @param object The `object` parameter is of type `Partial<T>`, which means it can be an object that
 * contains some or none of the properties defined in the type `T`.
 * @param keys The `keys` parameter is an array of keys that we want to check if they exist in the
 * `object` parameter.
 *
 * @return a boolean value.
 */
const checkKeys = (object, keys) => {
    return keys.every((key) => Object.prototype.hasOwnProperty.call(object, key));
};
export default checkKeys;
//# sourceMappingURL=checkKeys.js.map