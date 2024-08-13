type KeyOf<T> = keyof T;

/**
 * The `removeProp` function removes specified properties from an object and returns a new object with
 * the remaining properties.
 * @param {T} obj - The `obj` parameter is the object from which properties will be removed. It is of
 * type `T`, which represents the type of the object.
 * @param {KeyOf<T>[]} keys - The `keys` parameter is an array of keys that you want to remove from the
 * `obj` object.
 * @returns The function `removeProp` returns a new object that is a partial copy of the input object
 * `obj`, with the specified keys removed.
 */
export function removeProp<T>(obj: T, keys: KeyOf<T>[]): Partial<T> {
  const newObj: Partial<T> = {};

  for (const key in obj) {
    if (!keys.includes(key)) {
      newObj[key] = obj[key];
    }
  }

  return newObj;
}

/**
 * The function removes empty fields from an object.
 *
 * @param obj The `obj` parameter is a generic type `T`, which means it can be any type. It represents
 * an object that you want to remove empty fields from.
 *
 * @return The function `removeEmptyFields` returns a new object of type `Partial<T>`, which is a
 * partial representation of the input object `obj`.
 */
export function removeEmptyFields<T>(obj: T): Partial<T> {
  const newObj: Partial<T> = {};

  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}


export function isCircular(obj: any): boolean {
  try {
    JSON.stringify(obj);
    return false;
  } catch (error) {
    return true;
  }
}