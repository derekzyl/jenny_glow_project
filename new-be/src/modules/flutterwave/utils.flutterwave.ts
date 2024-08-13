namespace RaveUtils {
  export function emptyCheck(value: any, message: string = 'Some error occurred') {
    if (!value || typeof value === 'undefined') {
      throw new Error(message);
    }
  }

  export function initDefaultValue<T>(value: T | undefined, default_value: T): T {
    return value !== undefined ? value : default_value;
  }
}

export default RaveUtils;
