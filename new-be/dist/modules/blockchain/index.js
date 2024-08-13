"use strict";
// import { initWasm, WalletCore } from '@trustwallet/wallet-core';
// import { CoinType, HDWallet } from '@trustwallet/wallet-core/dist/src/wallet-core';
// class MultiCoinWallet {
//   public walletStrength: number;
//   private passphrase: string;
//   protected walletCore: WalletCore | null = null;
//   protected wallet: HDWallet = new HDWallet();
//   public coinType: CoinType | null = null;
//   public defaultCoins: (keyof typeof CoinType)[] = [];
//   constructor(walletStrength: number = 128, passphrase: string = '') {
//     this.passphrase = passphrase;
//     this.walletStrength = walletStrength;
//     try {
//       initWasm()
//         .then((response) => {
//           this.walletCore = response;
//           this.wallet = HDWallet.create(this.walletStrength, this.passphrase);
//           // Access the instance properties
//           console.log('Passphrase:', this.passphrase);
//           console.log('Wallet Strength:', this.walletStrength);
//         })
//         .catch((error) => {
//           console.error('Failed to initialize WalletCore:', error);
//         });
//     } catch (error) {
//       console.error('Failed to initialize WalletCore:', error);
//     }
//     // this.wallet = HDWallet.create(this.walletStrength, this.passphrase);
//     this.coinType = null;
//     console.log(this.wallet);
//   }
//   // static async create(passphrase: string = '', walletStrength: number = 128): Promise<MultiCoinWallet> {
//   //   const wallet = new MultiCoinWallet(passphrase, walletStrength);
//   //   await wallet.initialize();
//   //   return wallet;
//   // }
//   // async initialize(): Promise<void> {
//   //   try {
//   //     this.walletCore = await initWasm();
//   //     this.wallet = HDWallet.create(this.walletStrength, this.passphrase);
//   //     // Access the instance properties
//   //     console.log('Passphrase:', this.passphrase);
//   //     console.log('Wallet Strength:', this.walletStrength);
//   //   } catch (error) {
//   //     console.error('Failed to initialize WalletCore:', error);
//   //   }
//   // }
//   getCoinType(coin: string): CoinType {
//     return CoinType[coin as keyof typeof CoinType];
//   }
//   getAddressForCoin(coin: string): string {
//     let coinType = this.getCoinType(coin);
//     let address = this.wallet.getAddressForCoin(coinType);
//     console.log(address);
//     return address;
//   }
//   generateNewAddressForCoin(coin: string): string {
//     // generate new address for a specific coin
//     return coin;
//   }
// }
//# sourceMappingURL=index.js.map