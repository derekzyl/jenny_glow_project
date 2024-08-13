/* eslint-disable @typescript-eslint/naming-convention */
// Move to DB
import { logger } from '../logger';
// Btc
// Doge and shiba
// Usdt
// Eth
// Litcoin
// Xrp
// add extra 3 coins
// ETH-based coins => [usdt, shiba]
export var currencyTypes;
(function (currencyTypes) {
    currencyTypes["crypto"] = "CRYPTO";
    currencyTypes["fiat"] = "FIAT";
})(currencyTypes || (currencyTypes = {}));
// export type CryptoCurrencies = 'BTC' | 'ETH' | 'LTC' | 'XRP' | 'USDT' | 'DOGE' | 'SHIB';
// Define excluded currencies
// type ExcludedCurrencies = 'GBP' | 'ZAR' | 'KES' | 'GHS' | 'XAF' | 'XOF' | 'UGX' | 'TZS' | 'RWF' | 'EUR' | 'CAD' | 'AUD';
// Extend the Currencies type with additional currencies
// export type CurrencyCodes = Exclude<Currencies, ExcludedCurrencies> | CryptoCurrencies;
// Define enum for fiat currencies
export var FiatCurrencyCodes;
(function (FiatCurrencyCodes) {
    FiatCurrencyCodes["NGN"] = "NGN";
})(FiatCurrencyCodes || (FiatCurrencyCodes = {}));
// Define enum for crypto currencies
// todo export const cryptoCurrencyCodes = await getAllTradableAssetsTypes();
export const cryptoCurrencyCodes = ['BTC', 'ETH', 'SOL', 'LTC', 'DOGE'];
logger.info(cryptoCurrencyCodes);
// export const
// Combine both enums into a single enum
export const allCurrencyCodes = [...Object.values(FiatCurrencyCodes), ...Object.values(cryptoCurrencyCodes)];
export var paymentProviders;
(function (paymentProviders) {
    paymentProviders["flutterwave"] = "FLUTTERWAVE";
    paymentProviders["fiat"] = "FIAT";
})(paymentProviders || (paymentProviders = {}));
export const defaultCrytoNodes = {
    ethereum: {
        rpc: process.env['ETHEREUM_RPC'],
        wss: process.env['ETHEREUM_WSS'],
        g_address: process.env['ETH_GENERATOR_ADDRESS'],
        g_address_pk: process.env['ETH_GENERATOR_PRIVATE_KEY'],
    },
    doge: {
        rpc: process.env['POLYGON_RPC'],
        wss: process.env['POLYGON_WSS'],
        g_address: process.env['MATIC_GENERATOR_ADDRESS'],
        g_address_pk: process.env['MATIC_GENERATOR_PRIVATE_KEY'],
    },
    shiba: {
        rpc: process.env['AVALANCHE_RPC'],
        wss: process.env['AVALANCHE_WSS'],
        g_address: process.env['AVAX_GENERATOR_ADDRESS'],
        g_address_pk: process.env['AVAX_GENERATOR_PRIVATE_KEY'],
    },
    ripple: {
        rpc: process.env['FANTOM_RPC'],
        wss: process.env['FANTOM_WSS'],
        g_address: process.env['FTM_GENERATOR_ADDRESS'],
        g_address_pk: process.env['FTM_GENERATOR_PRIVATE_KEY'],
    },
    bitcoin: {
        rpc: process.env['BSC_RPC'],
        wss: process.env['BSC_WSS'],
        g_address: process.env['BNB_GENERATOR_ADDRESS'],
        g_address_pk: process.env['BNB_GENERATOR_PRIVATE_KEY'],
    },
};
export const cryptoChains = Object.keys(defaultCrytoNodes);
export var NetworkBitpwrE;
(function (NetworkBitpwrE) {
    NetworkBitpwrE["TESTNET"] = "TESTNET";
    NetworkBitpwrE["MAINNET"] = "MAINNET";
})(NetworkBitpwrE || (NetworkBitpwrE = {}));
export var ModeBitpwrE;
(function (ModeBitpwrE) {
    ModeBitpwrE["LIVE"] = "LIVE";
    ModeBitpwrE["TEST"] = "TEST";
})(ModeBitpwrE || (ModeBitpwrE = {}));
//# sourceMappingURL=currencies.js.map