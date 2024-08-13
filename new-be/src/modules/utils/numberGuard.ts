/**
 * The function "isNumber" checks if a value is of type number.
 *
 * @param value The parameter "value" can be any type of value.
 *
 * @return a boolean value.
 */
export function isNumber(value: any): value is number {
  return typeof value === 'number';
}

/**
 * The function `convertToNum` converts a value to a number if possible, otherwise it throws an error.
 *
 * @param value The `value` parameter can be of any type. The function `convertToNum` will attempt to
 * convert it into a number. If the `value` is already a number, it will be returned as is. If the
 * `value` is a string, it will be parsed into a number
 *
 * @return a number.
 */
export function convertToNum(value: any): number {
  if (typeof value === 'number') {
    if (Number.isFinite(value) && !Number.isNaN(value)) {
      return value;
    } else {
      throw new Error('Invalid number');
    }
  } else if (typeof value === 'string') {
    if (!/^[0-9]+(\.[0-9]+)?$/.test(value)) {
      throw new Error('Invalid number');
    }

    const parsedValue = Number(value);
    if (Number.isFinite(parsedValue) && !Number.isNaN(parsedValue)) {
      return parsedValue;
    } else {
      throw new Error('Invalid number');
    }
  } else {
    throw new Error('This is not a number');
  }
}
