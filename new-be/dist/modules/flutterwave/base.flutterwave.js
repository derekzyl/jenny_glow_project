import axios from 'axios';
// import * as q from 'q';
import { logger } from '../logger';
import { removeProp } from '../utils/remove';
import querystring from 'querystring';
import * as Security from './security.flutterwave';
import RaveUtils from './utils.flutterwave';
export default class Base {
    constructor(publicKey, secretKey, baseUrl) {
        RaveUtils.emptyCheck(publicKey, 'Public Key required');
        RaveUtils.emptyCheck(secretKey, 'Secret Key required');
        this.publicKey = publicKey;
        this.secretKey = secretKey;
        this.baseUrl = 'https://api.flutterwave.com/';
        // Override BaseURL
        if (baseUrl && typeof baseUrl === 'string') {
            this.baseUrl = baseUrl;
        }
    }
    getPublicKey() {
        return this.publicKey;
    }
    getSecretKey() {
        return this.secretKey;
    }
    getBaseUrl() {
        return this.baseUrl;
    }
    setBaseUrl(newBaseUrl) {
        if (newBaseUrl) {
            this.baseUrl = newBaseUrl;
        }
    }
    async request(path, payload, method, callback) {
        const requestOptions = {
            url: path,
            baseURL: this.getBaseUrl(),
            method: RaveUtils.initDefaultValue(method, 'POST' || 'PUT'),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.getSecretKey()}`,
            },
        };
        const requestMethod = requestOptions.method;
        const dataKey = requestMethod === 'POST' || requestMethod === 'PUT' ? 'data' : 'params';
        const includeQueryParams = RaveUtils.initDefaultValue(payload.excludeQuery, false);
        if (requestMethod === 'GET') {
            // delete method;
            if (includeQueryParams) {
                removeProp(payload, ['excludeQuery', 'method']);
                requestOptions.url = path;
            }
            else {
                const data = removeProp(payload, ['excludeQuery', 'method']);
                const queryParams = querystring.stringify(data);
                requestOptions.url += `?${queryParams}`;
            }
        }
        else {
            const data = removeProp(payload, ['excludeQuery', 'method']);
            requestOptions[dataKey] = RaveUtils.initDefaultValue(Object.assign({}, data), {});
        }
        try {
            logger.info(`request options: ${JSON.stringify(requestOptions)}`);
            const response = await axios(requestOptions);
            if (callback) {
                callback(null, response.data, response);
            }
            logger.info(`response data: ${JSON.stringify(response.status)} ${JSON.stringify(response.data)}`);
            return response;
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                if (callback) {
                    callback(error.toJSON(), error.response ? error.response.data : null, error.response);
                    logger.error(`response error: ${error.toJSON()} `);
                }
            }
            else {
                if (callback) {
                    callback(error, error.response ? error.response.data : null, error.response);
                }
                logger.error(`response error: ${JSON.stringify(JSON.parse(error))} `);
            }
            Base.handleAxiosError(error, callback);
            throw error;
        }
    }
    encrypt(data) {
        const encryptionKey = Security.getEncryptionKey(this.getSecretKey());
        return Security.encrypt(encryptionKey, JSON.stringify(data));
    }
    getIntegrityHash(data) {
        return Security.getIntegrityHash(data, this.getPublicKey(), this.getSecretKey());
    }
    static handleAxiosError(error, callback) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                // The request was made and the server responded with a status code that falls out of the range of 2xx
                logger.error(`Error Response Data: ${JSON.stringify(error.response.data)}`);
                logger.error(`Error Response Status: ${error.response.status}`);
                logger.error(`Error Response Headers: ${JSON.stringify(error.response.headers)}`);
                // Additional error handling based on status code
                switch (error.response.status) {
                    case 400:
                        logger.error('Bad Request - Often missing a required parameter.');
                        break;
                    case 401:
                        logger.error('Unauthorized - No valid API key provided.');
                        break;
                    case 403:
                        logger.error("Forbidden - The API key doesn't have permissions to perform the request.");
                        break;
                    case 404:
                        logger.error("Not Found - The requested resource doesn't exist.");
                        break;
                    case 500:
                        logger.error('Internal Server Error - We had a problem with our server. Try again later.');
                        break;
                    default:
                        logger.error(`Unhandled error response status: ${error.response.status}`);
                }
            }
            else if (error.request) {
                // The request was made but no response was received
                logger.error(`Error Request Data: ${JSON.stringify(error.request)}`);
                logger.error('No response received. Possible network error or CORS issue.');
            }
            else {
                // Something happened in setting up the request that triggered an Error
                logger.error(`Error Message: ${error.message}`);
            }
            logger.error(`Error Config: ${JSON.stringify(error.config)}`);
            if (callback) {
                callback(error.toJSON(), error.response ? error.response.data : null, error.response);
            }
        }
        else {
            logger.error(`Non-Axios error: ${error}`);
            if (callback) {
                callback(error, error.response ? error.response.data : null, error.response);
            }
        }
    }
}
/**
 * Get an instance of the Base class.
 *
 * @param publicKey - The public key.
 * @param secretKey - The secret key.
 * @param baseUrl - Optional base URL.
 * @returns An instance of the Base class.
 */
export function getClassInstance(publicKey, secretKey, baseUrl) {
    return new Base(publicKey, secretKey, baseUrl);
}
//# sourceMappingURL=base.flutterwave.js.map