/**
 * The `pick` function takes an object and an array of keys, and returns a new object with only the
 * specified keys from the original object.
 * @param object - The `object` parameter is an object that contains key-value pairs. It can be any
 * JavaScript object.
 * @param {string[]} keys - An array of strings representing the keys of the properties to be picked
 * from the object.
 */
const pick = (object: Record<string, any>, keys: string[]) =>
  keys.reduce((obj: any, key: string) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = object[key];
    }
    return obj;
  }, {});

type KeyOf<T> = keyof T;

/**
 * The `easyPick` function takes an object and an array of keys, and returns a new object with only the
 * properties specified by the keys.
 * @param object - The `object` parameter is an object of type `T` or a partial object of type `T`. It
 * represents the object from which properties will be picked.
 * @param {KeyOf<T>[]} keys - An array of keys that represent the properties to be picked from the
 * `object` parameter.
 */
const easyPick = <T>(object: Partial<T>, keys: KeyOf<T>[]): Partial<T> =>
  /* The `(obj, key) => {...}` function is a callback function used in the `reduce` method. It is
  responsible for iterating over the `keys` array and picking the corresponding properties from the
  `object` parameter. */
  keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = object[key];
    }
    return obj;
  }, {} as Partial<T>);
export { easyPick };
export default pick;

// pick<T extends object, U extends keyof T>(object: T, ...props: Array<Many<U>>): Pick<T, U>;
