/* eslint-disable no-param-reassign */
import { logger } from '../logger';
import { removeProp } from '../utils/remove';
import axios from 'axios';
import querystring from 'querystring';
import BitPwrUtils from './utils.bitpwr';
/* The `Base` class is a TypeScript class that provides methods for handling authentication, setting
base URL, and making HTTP requests using Axios. */
export default class Base {
    /**
     * The constructor function initializes the publicKey, secretKey, and baseUrl properties of an
     * object.
     * @param {string} publicKey - A string representing the public key used for authentication or
     * encryption purposes.
     * @param {string} secretKey - The `secretKey` parameter is a string that represents a secret key
     * used for authentication or encryption purposes. It is typically kept confidential and should not
     * be shared publicly.
     * @param {string} [baseUrl] - The `baseUrl` parameter is an optional parameter that represents the
     * base URL of the API endpoint. It is used to specify the base URL for making API requests. If a
     * `baseUrl` is provided, it will be assigned to the `baseUrl` property of the class instance. If no
     * `baseUrl`
     */
    constructor(publicKey, secretKey, baseUrl) {
        this.baseUrl = 'https://developers.bitpowr.com/api/v1';
        this.publicKey = publicKey;
        this.secretKey = secretKey;
        if (baseUrl)
            this.baseUrl = baseUrl;
    }
    /**
     * The function returns the public key.
     * @returns The public key is being returned.
     */
    getPublicKey() {
        return this.publicKey;
    }
    /**
     * The function returns the secret key.
     * @returns The secret key is being returned.
     */
    getSecretKey() {
        return this.secretKey;
    }
    setPublicKey(publicKey) {
        this.publicKey = publicKey;
    }
    setSecretKey(secretKey) {
        this.secretKey = secretKey;
    }
    /**
     * The function `getAuthToken` returns an authentication token using the provided public and secret
     * keys.
     * @returns the authentication token generated using the publicKey and secretKey.
     */
    getAuthToken() {
        const bitpwrAuth = BitPwrUtils.getAuthenticationToken(this.publicKey, this.secretKey);
        return bitpwrAuth;
    }
    setBaseUrl(baseUrl) {
        this.baseUrl = baseUrl;
    }
    /**
     * The function returns the base URL.
     * @returns The `baseUrl` value is being returned.
     */
    getBaseUrl() {
        return this.baseUrl;
    }
    /**
     * The `request` function is an asynchronous function that sends HTTP requests using Axios and
     * handles the response and error callbacks.
     *
     * @param  - `path` (string): The URL path for the request.
     *
     * @return a Promise that resolves to the AxiosResponse object.
     */
    async request({ data, path, method, callback, }) {
        var _a;
        const requestOptions = {
            url: path,
            method: BitPwrUtils.initDefaultValue(method, 'POST' || 'PUT'),
            baseURL: this.getBaseUrl(),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.getAuthToken()}`,
            },
        };
        const requestMethod = requestOptions.method;
        const dataKey = requestMethod === 'POST' || requestMethod === 'PUT' ? 'data' : 'params';
        const includeQueryParams = BitPwrUtils.initDefaultValue(data.includeQueryParams, false);
        if (requestMethod === 'GET') {
            if (includeQueryParams) {
                const newData = removeProp(data, ['includeQueryParams']);
                const queryParams = querystring.stringify(newData);
                requestOptions.url = `${path}?${queryParams}`;
            }
            else {
                delete data.includeQueryParams;
                requestOptions.url = path;
            }
        }
        else {
            requestOptions[dataKey] = BitPwrUtils.initDefaultValue(data, {});
        }
        try {
            const response = await axios(requestOptions);
            if (callback) {
                callback({ status: response.status, data: response.data, response, error: null });
            }
            return response;
        }
        catch (error) {
            if (callback) {
                callback({
                    status: error.response.status,
                    error,
                    data: (_a = error.response.data) !== null && _a !== void 0 ? _a : null,
                    response: error.response,
                });
            }
            logger.error(`bitpwr error ${JSON.stringify(error)}`);
            throw new Error(error);
        }
    }
}
/**
 * The function returns an instance of the Base class with the provided public key, secret key, and
 * optional base URL.
 * @param {string} publicKey - The publicKey parameter is a string that represents the public key used
 * for authentication.
 * @param {string} secretKey - The `secretKey` parameter is a string that represents a secret key used
 * for authentication or encryption purposes. It is typically used in combination with a public key to
 * securely exchange information or perform cryptographic operations.
 * @param {string} [baseUrl] - The `baseUrl` parameter is an optional parameter that represents the
 * base URL of the API endpoint. It is used to specify the base URL for making API requests. If no
 * `baseUrl` is provided, the default base URL will be used.
 * @returns The `getClassInstance` function is returning an instance of the `Base` class.
 */
export function getClassInstance(publicKey, secretKey, baseUrl) {
    const base = new Base(publicKey, secretKey, baseUrl);
    return base;
}
//# sourceMappingURL=base.bitpwr.js.map