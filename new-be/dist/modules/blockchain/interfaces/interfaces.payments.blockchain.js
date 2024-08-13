export const CHAINS = {
    BTC: {
        coinId: 0,
        name: 'bitcoin',
        network: {
            mainnet: [
                {
                    weight: 'high',
                    url: 'https://bitcoin-blockbook.twnodes.com',
                },
            ],
            testnet: [],
        },
    },
    ETH: {
        coinId: 60,
        name: 'ethereum',
        network: {
            mainnet: [
                {
                    weight: 'high',
                    url: 'https://ethereum.twnodes.com',
                },
                {
                    weight: 'low',
                    url: 'https://rpc.ankr.com/eth',
                },
            ],
            testnet: [],
        },
        supportedTokens: ['USDT', 'SHIB'],
    },
    LTC: {
        coinId: 2,
        name: 'litecoin',
        network: {
            mainnet: [
                {
                    weight: 'high',
                    url: 'https://litecoin-blockbook.twnodes.com',
                },
            ],
            testnet: [],
        },
    },
    XRP: {
        coinId: 144,
        name: 'xrp',
        network: {
            mainnet: [
                {
                    weight: 'high',
                    url: 'https://conflux-evm.twnodes.com',
                },
                {
                    weight: 'low',
                    url: 'https://evm.confluxrpc.com',
                },
            ],
            testnet: [
                {
                    weight: 'high',
                    url: 'https://s.altnet.rippletest.net:51234/',
                },
            ],
        },
    },
    DOGE: {
        coinId: 3,
        name: 'dogecoin',
        network: {
            mainnet: [
                {
                    weight: 'high',
                    url: 'https://doge-blockbook.twnodes.com',
                },
                {
                    weight: 'low',
                    url: 'https://dogecoin.atomicwallet.io',
                },
            ],
            testnet: [],
        },
    },
};
export const ChainsByCoinId = Object.entries(CHAINS).reduce((acc, [chainId, chainInfo]) => {
    acc[chainInfo.coinId] = chainInfo;
    acc[chainInfo.coinId].currencyCode = chainInfo.currencyCode === undefined ? chainId : chainId;
    return acc;
}, {});
//# sourceMappingURL=interfaces.payments.blockchain.js.map