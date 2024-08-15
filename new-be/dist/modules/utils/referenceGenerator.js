import bigInt from 'big-integer';
import { v4 as uuidv4 } from 'uuid';
/**
 * Generate reference based on given length
 * @param {number} length
 * @returns {number}
 */
export var GeneratekeyE;
(function (GeneratekeyE) {
    GeneratekeyE["alphanum"] = "alphanum";
    GeneratekeyE["letters"] = "letters";
    GeneratekeyE["numbers"] = "numbers";
    GeneratekeyE["default"] = "default";
    GeneratekeyE["alphanumLower"] = "alphanumLower";
    GeneratekeyE["alphanumUpper"] = "alphanumUpper";
    GeneratekeyE["characters"] = "characters";
    GeneratekeyE["password"] = "password";
})(GeneratekeyE || (GeneratekeyE = {}));
export var GeneratePrefixType;
(function (GeneratePrefixType) {
    GeneratePrefixType["NONE"] = "";
    GeneratePrefixType["CHAT"] = "CHAT";
    GeneratePrefixType["REFERRAL"] = "REF";
    GeneratePrefixType["ORDER"] = "ORD";
    GeneratePrefixType["PAYMENT"] = "PAY";
    GeneratePrefixType["VOUCHER"] = "VOUCH";
    GeneratePrefixType["BRANCH"] = "BCH";
    GeneratePrefixType["INVENTORY"] = "INV";
    GeneratePrefixType["PRODUCT"] = "PROD";
    GeneratePrefixType["CATEGORY"] = "CAT";
    GeneratePrefixType["SUB_CATEGORY"] = "SUBCAT";
    GeneratePrefixType["CUSTOMER"] = "CUST";
    GeneratePrefixType["SUPPLIER"] = "SUP";
    GeneratePrefixType["USER"] = "USER";
    GeneratePrefixType["ROLE"] = "ROLE";
    GeneratePrefixType["PERMISSION"] = "PERM";
    GeneratePrefixType["REFUND"] = "REFUND";
    GeneratePrefixType["RETURN"] = "RETURN";
    GeneratePrefixType["DISCOUNT"] = "DISCOUNT";
    GeneratePrefixType["STOCK"] = "STOCK";
    GeneratePrefixType["STOCK_TRANSFER"] = "STOCK_TRS";
})(GeneratePrefixType || (GeneratePrefixType = {}));
/**
 * The function `generateAlphanumericReference` generates a random alphanumeric reference of a
 * specified size, with optional prefix and character type.
 *
 * @param size The `size` parameter determines the length of the generated alphanumeric reference. It
 * specifies the number of characters that the reference will have.
 * @param type The `type` parameter in the `generateAlphanumericReference` function is used to specify
 * the type of characters to include in the generated alphanumeric reference. It accepts the following
 * values:
 * @param prefix The `prefix` parameter is an optional parameter that allows you to add a prefix to the
 * generated alphanumeric reference. If you don't provide a prefix, the generated reference will not
 * have a prefix.
 *
 * @return a randomly generated alphanumeric reference string. If a prefix is provided, it will be
 * appended to the beginning of the reference string.
 */
export function generateAlphanumericReference(size = 16, type = GeneratekeyE.alphanumLower, prefix = GeneratePrefixType.NONE, addDash = true) {
    const numbers = '0123456789';
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const commonCharacters = '.@$#*';
    const characters = 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿŒœŠšŸƒˆ˜¡¢£¤¥€¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρςστυφχψωϑϒϖ†‡•…‰′″‾⁄℘ℑℜ™ℵ←↑→↓↔↵⇐⇑⇒⇓⇔∀∂∃∅∇∈∉∋∏∑−∗√∝∞∠∧∨∩∪∫∴∼≅≈≠≡≤≥⊂⊃⊄⊆⊇⊕⊗⊥⋅⌈⌉⌊⌋⟨⟩◊♠♣♥♦';
    const presets = {
        numbers,
        letters: `${letters}${letters.toUpperCase()}`,
        alphanum: `${letters}${numbers}${letters.toUpperCase()}`,
        characters,
        default: `${numbers}${letters}${letters.toUpperCase()}${characters}`,
        password: `${commonCharacters}${numbers}${letters}${letters.toUpperCase()}`,
        alphanumUpper: `${letters.toUpperCase()}${numbers}`,
        alphanumLower: `${letters}${numbers}`,
    };
    const presetType = presets[type];
    const genKey = Array(size)
        .fill(null)
        .map(() => presetType.charAt(Math.round(Math.random() * presetType.length) - 1));
    let result;
    if (prefix.length <= 0) {
        result = genKey.join('');
    }
    else if (addDash) {
        result = `${prefix}-${genKey.join('')}`;
    }
    else {
        result = `${prefix}${genKey.join('')}`;
    }
    return result;
}
/* `const presetType = presets[type];` is retrieving the preset character set based on the `type`
parameter provided to the `generateAlphanumericReference` function. The `presets` object contains
different preset character sets for various types like numbers, letters, alphanumeric characters,
etc. */
export function easyReferenceGenerator({ size = 16, type = GeneratekeyE.alphanumLower, prefix = GeneratePrefixType.NONE, addDash = true, }) {
    return generateAlphanumericReference(size, type, prefix, addDash);
}
export const generateReference = (length) => {
    return generateAlphanumericReference(length, GeneratekeyE.numbers);
};
/**
 * The function generates a unique ID based on the current date and time, along with a provided type.
 * @param {string} type - The `type` parameter is a string that represents the type of the ID being
 * generated. It is used to create a unique identifier for a specific type of object or entity.
 * @returns a string that is generated based on the current date and time, along with a random number
 * and the provided type parameter. The returned string has the following format:
 * "TYPE_YYYYMMDDHH_MMSS_RANDOMNUMBER".
 */
export function generateIdWithDate(type = '') {
    const id = new Date();
    const i = id.toLocaleString();
    const j = i.split(',')[0];
    const k = j.split('/').join('');
    const l = i.split(',')[1];
    const m = l.split(' ')[1];
    const n = m.split(':')[0];
    const o = m.split(':')[1];
    const p = m.split(':')[2];
    const q = Math.round(Math.random() * 90000 + 10000);
    const r = `${type.toUpperCase()}-${k}${n}${o}-${p}${o}${n}-${q}`;
    return r;
}
/**
 * Generate UUID
 * @returns {string}
 */
export const generateUUID = () => {
    const lUUID = uuidv4().replace(/-/g, ''); // Generate a UUID and remove hyphens
    const bigInteger = bigInt(lUUID, 16);
    const formattedUUID = bigInteger.toString(10).padStart(40, '0');
    return formattedUUID;
};
/**
 * Convert hex string to int
 *
 * @param {string} hexString - Hexadecimal string
 * @returns {number} - Integer value
 */
/* The line `const bigInteger = bigInt(lUUID, 16);` is creating a big integer object using the
`big-integer` library. */
export const convertHexToInteger = (hexString) => {
    // Ensure the hex string starts with '0x'
    // if (!hexString.startsWith('0x')) {
    //   throw new Error('Invalid hex string, it must start with "0x"');
    // }
    // Parse the hexadecimal string and convert to an integer
    const integerValue = parseInt(hexString, 16);
    return integerValue;
};
/**
 * Generate a reference from a hex string by converting it to a UInt32 number.
 *
 * @param {string} hexString - Hexadecimal string
 * @returns {number} - UInt32 number
 */
export const generateReferenceFromHex = (hexString) => {
    // Normalize hex string
    const normalizedHexString = hexString.toUpperCase().replace(/[^0-9A-F]/g, '');
    // Calculate sum of hexadecimal digits
    let sum = 0;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < normalizedHexString.length; i++) {
        const tempStr = normalizedHexString[i];
        if (tempStr !== undefined) {
            sum += parseInt(tempStr, 16);
        }
    }
    // Apply modulo operation
    const uintID = sum % 2 ** 16; // sum % 2 ** 31;
    return uintID;
};
//# sourceMappingURL=referenceGenerator.js.map