import crypto from 'crypto';
import { Buffer } from 'node:buffer';
import config from '../../config/config';
export class ENCRYPT {
    constructor(data) {
        this.password = config.encrypt.password;
        this.salt = config.encrypt.salt;
        this.iv = Buffer.alloc(16, 0, 'hex');
        this.algorithm = 'aes-192-cbc';
        if (data) {
            const { password, salt, iv } = data;
            this.password = password;
            this.salt = salt;
            this.iv = iv;
            this.key = crypto.scryptSync(this.password, this.salt, 24);
        }
        else {
            this.key = Buffer.alloc(24);
        }
    }
    /**
     * Encrypts the given data using the specified algorithm, key, and initialization vector.
     *
     * @param {string} myData - The data to be encrypted.
     * @return {string} The encrypted data.
     */
    encrypting(myData) {
        const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
        return `${cipher.update(myData, 'utf8', 'hex')}${cipher.final('hex')}`;
    }
    decrypting(data) {
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
        return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
    }
}
const crypt = new ENCRYPT();
export function encryptMe(data) {
    const g = crypt.encrypting(data);
    return g;
}
export function decryptMe(data) {
    const g = crypt.decrypting(data);
    return g;
}
export function decodeBase64(encodedValue) {
    // Using Buffer.from to decode from Base64
    const decodedValue = Buffer.from(encodedValue, 'base64').toString('utf-8');
    return decodedValue;
}
//# sourceMappingURL=encrypt.js.map