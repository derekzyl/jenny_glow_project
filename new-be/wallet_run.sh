#!/usr/bin/sh

#Run tsc
yarn tsc --skipLibCheck --allowJs src/modules/blockchain/wallet.blockchain.ts
mv src/modules/blockchain/wallet.blockchain.js src/modules/blockchain/wallet.blockchain.cjs
node src/modules/blockchain/wallet.blockchain.cjs
rm src/modules/blockchain/wallet.blockchain.cjs


# trust wallet experiment - width silver donate metal coin thunder shy stem liar bid build swim
# https://www.linkedin.com/pulse/how-does-each-bitcoin-wallet-find-other-nodes-connect-esmaeilzadeh/

# https://bitcoin.stackexchange.com/questions/113446/is-there-a-way-to-broadcast-a-bitcoin-transaction-without-internet-access

# https://www.quora.com/How-does-the-Bitcoin-wallet-communicate-with-the-nodes-to-relay-the-new-transaction

# https://www.quora.com/What-is-the-software-architecture-that-lies-behind-online-trading-systems
