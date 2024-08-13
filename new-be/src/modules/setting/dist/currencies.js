"use strict";
/* eslint-disable @typescript-eslint/naming-convention */
// Move to DB
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.ModeBitpwrE = exports.NetworkBitpwrE = exports.cryptoChains = exports.defaultCrytoNodes = exports.paymentProviders = exports.allCurrencyCodes = exports.cryptoCurrencyCodes = exports.FiatCurrencyCodes = exports.currencyTypes = void 0;
var logger_1 = require("@modules/logger");
var service_currency_wallet_1 = require("@modules/wallet/services/service.currency.wallet");
// Btc
// Doge and shiba
// Usdt
// Eth
// Litcoin
// Xrp
// add extra 3 coins
// ETH-based coins => [usdt, shiba]
var currencyTypes;
(function (currencyTypes) {
    currencyTypes["crypto"] = "CRYPTO";
    currencyTypes["fiat"] = "FIAT";
})(currencyTypes = exports.currencyTypes || (exports.currencyTypes = {}));
// export type CryptoCurrencies = 'BTC' | 'ETH' | 'LTC' | 'XRP' | 'USDT' | 'DOGE' | 'SHIB';
// Define excluded currencies
// type ExcludedCurrencies = 'GBP' | 'ZAR' | 'KES' | 'GHS' | 'XAF' | 'XOF' | 'UGX' | 'TZS' | 'RWF' | 'EUR' | 'CAD' | 'AUD';
// Extend the Currencies type with additional currencies
// export type CurrencyCodes = Exclude<Currencies, ExcludedCurrencies> | CryptoCurrencies;
// Define enum for fiat currencies
var FiatCurrencyCodes;
(function (FiatCurrencyCodes) {
    FiatCurrencyCodes["NGN"] = "NGN";
})(FiatCurrencyCodes = exports.FiatCurrencyCodes || (exports.FiatCurrencyCodes = {}));
// Define enum for crypto currencies
exports.cryptoCurrencyCodes = await service_currency_wallet_1.getAllTradableAssetsTypes();
logger_1.logger.info(exports.cryptoCurrencyCodes);
// export const
// Combine both enums into a single enum
exports.allCurrencyCodes = __spreadArrays(Object.values(FiatCurrencyCodes), Object.values(exports.cryptoCurrencyCodes));
var paymentProviders;
(function (paymentProviders) {
    paymentProviders["flutterwave"] = "FLUTTERWAVE";
    paymentProviders["fiat"] = "FIAT";
})(paymentProviders = exports.paymentProviders || (exports.paymentProviders = {}));
exports.defaultCrytoNodes = {
    ethereum: {
        rpc: process.env['ETHEREUM_RPC'],
        wss: process.env['ETHEREUM_WSS'],
        g_address: process.env['ETH_GENERATOR_ADDRESS'],
        g_address_pk: process.env['ETH_GENERATOR_PRIVATE_KEY']
    },
    doge: {
        rpc: process.env['POLYGON_RPC'],
        wss: process.env['POLYGON_WSS'],
        g_address: process.env['MATIC_GENERATOR_ADDRESS'],
        g_address_pk: process.env['MATIC_GENERATOR_PRIVATE_KEY']
    },
    shiba: {
        rpc: process.env['AVALANCHE_RPC'],
        wss: process.env['AVALANCHE_WSS'],
        g_address: process.env['AVAX_GENERATOR_ADDRESS'],
        g_address_pk: process.env['AVAX_GENERATOR_PRIVATE_KEY']
    },
    ripple: {
        rpc: process.env['FANTOM_RPC'],
        wss: process.env['FANTOM_WSS'],
        g_address: process.env['FTM_GENERATOR_ADDRESS'],
        g_address_pk: process.env['FTM_GENERATOR_PRIVATE_KEY']
    },
    bitcoin: {
        rpc: process.env['BSC_RPC'],
        wss: process.env['BSC_WSS'],
        g_address: process.env['BNB_GENERATOR_ADDRESS'],
        g_address_pk: process.env['BNB_GENERATOR_PRIVATE_KEY']
    }
};
exports.cryptoChains = Object.keys(exports.defaultCrytoNodes);
var NetworkBitpwrE;
(function (NetworkBitpwrE) {
    NetworkBitpwrE["TESTNET"] = "TESTNET";
    NetworkBitpwrE["MAINNET"] = "MAINNET";
})(NetworkBitpwrE = exports.NetworkBitpwrE || (exports.NetworkBitpwrE = {}));
var ModeBitpwrE;
(function (ModeBitpwrE) {
    ModeBitpwrE["LIVE"] = "LIVE";
    ModeBitpwrE["TEST"] = "TEST";
})(ModeBitpwrE = exports.ModeBitpwrE || (exports.ModeBitpwrE = {}));
