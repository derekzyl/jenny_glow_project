# DUMP.md

```typescript
// wallet.delete();
// key.delete();
// pubKey.delete();
// address.delete();

// console.log(`Create ${name} wallet: ${mnemonic}`);
// console.log(`Get ${coin} public key: ${HexCoding.encode(pubKey.data())}`);
// console.log(`Get ${coin} address: ${address.description()}`);
// console.log(`coinType.value = ${coinType.value}`);
// console.log('Ethereum protobuf models: \n', TW.Ethereum);
// console.log('Keystore JSON: \n', JSON.stringify(storedWallet, null, 2));

// TW.Bitcoin;

// Get the key for the first coin type in the `coinTypes` array.
// const key = wallet.getKeyForCoin(coinType);

// Get the public key for the key.
// const pubKey = key.getPublicKeySecp256k1(false);

// Create an address for the public key.
// const address = AnyAddress.createWithPublicKey(pubKey, coinType);

// console.log(`Create ${name} wallet: ${mnemonic}`);
// console.log('Keystore JSON: \n', JSON.stringify(storedWallet, null, 2));
```

```typescript
// func to extract addresses from wallet

// // Wrapper for a wallet stored in keystore
// class StoredKeyWallet {
//   wallet: any; // StoredKey
//   wc: WalletCore;

//   constructor(w: any, wc: WalletCore) {
//     this.wallet = w;
//     this.wc = wc;
//   }

//   accountCount(): Number {
//     return this.wallet.accountCount();
//   }
//   status(): string {
//     return `Wallet '${this.wallet.name()}', with ${this.wallet.accountCount()} addresses`;
//   }
//   dump(): void {
//     console.error(`Wallet '${this.wallet.name()}', ${this.wallet.isMnemonic() ? 'type mnemonic' : ''}:`);

//     if (this.wallet.accountCount() == 0) {
//       console.log('No addresses');
//       // return null;
//     } else {
//       console.log('Addresses:');
//       // let addreses = [];
//       const n = this.wallet.accountCount();
//       for (var i = 0; i < n; ++i) {
//         const a = this.wallet.account(i);
//         console.log(`  ${this.wc.CoinTypeConfiguration.getSymbol(a.coin())}:  ${a.address()}`);
//       }
//     }
//   }
// }

// // Handles several wallets, with keystore
// class TestWalletManager {
//   // single opened StoredKeyWallet instance
//   wallet: StoredKeyWallet | null = null;
//   StoreFolderPath = './tmp/devconsole';
//   StoreFixedPassword = 'devconsole';
//   HDWalletPassord = '';
//   DefaultCoins: any[] = [];
//   keystore: any = null;
//   // wallets available in storage
//   storeWallets: any[] = [];

//   init(): void {
//     let wc: WalletCore;
//     if (!this.wallet) {
//       wc = this.wallet?.wc; // find a way to remove null
//     }

//     this.DefaultCoins = [wc.CoinType.bitcoin, wc.CoinType.ethereum, wc.CoinType.binance];
//     this.keystore = null;
//     // check and try to create store folder
//     if (!fs.existsSync(this.StoreFolderPath)) {
//       // try to create, ignore error
//       fs.mkdirSync(this.StoreFolderPath);
//     }
//     // check again
//     if (!fs.existsSync(this.StoreFolderPath)) {
//       console.log(`ERROR: Could not open/create storage folder!  Wallet storage will not work.  '${this.StoreFolderPath}'`);
//       return;
//     }
//     const storage = new KeyStore.FileSystemStorage(this.StoreFolderPath);
//     this.keystore = new KeyStore.Default(this.wallet?.wc, storage);
//   }

//   async refreshStoreWallets(): Promise<void> {
//     if (!this.keystore) {
//       return;
//     }
//     process.stdout.write(`Refreshing wallets list ... `);
//     try {
//       this.storeWallets = await this.keystore.loadAll();
//       console.log(`found ${this.storeWallets.length} wallets  (dir: ${this.StoreFolderPath})`);
//     } catch (err) {
//       console.log(`Exception: ${err}`);
//     }
//   }

//   async list(): Promise<void> {
//     if (!this.keystore) {
//       console.log(`Keystore not available!`);
//       return;
//     }
//     await this.refreshStoreWallets();
//     if (!this.storeWallets || this.storeWallets.length == 0) {
//       console.log('No wallets found in storage.');
//     } else {
//       let idx = 0;
//       console.log(`Found ${this.storeWallets.length} wallets in storage, use walletLoad(id) to load:`);
//       this.storeWallets.forEach((w) => console.log(`${idx++}:  ${w.name} \t${w.activeAccounts.length} addrs  \t${w.id}`));
//     }
//   }

//   async load(index: number) {
//     this.wallet = null;
//     if (!this.keystore) {
//       return;
//     }
//     try {
//       await this.refreshStoreWallets();
//       if (index >= this.storeWallets.length) {
//         console.log(`Index out of range, max ${this.storeWallets.length}`);
//         await this.list();
//         return;
//       }
//       const id = this.storeWallets[index].id;
//       process.stdout.write(`Loading wallet ${index} ${id} ... `);
//       const wallet = await this.keystore.load(id);
//       console.log('done');
//       this.wallet = new StoredKeyWallet(this.keystore.mapStoredKey(wallet), await initWasm());
//       this.status();
//     } catch (err) {
//       console.log(`Exception: ${err}`);
//     }
//   }

//   async loadAWallet() {
//     if (this.storeWallets.length > 0) {
//       await this.load(0);
//     }
//   }

//   autoFillName(name: string): string {
//     return name === '' ? `Wallet${(this.storeWallets.length + 1).toString()}` : name;
//   }

//   async create(strength: number, name: string): Promise<StoredKeyWallet | null> {
//     this.wallet = null;
//     if (!this.keystore) {
//       return null;
//     }
//     try {
//       if (name === '') {
//         name = this.autoFillName(name);
//       }
//       const hdWallet = wc.HDWallet.create(strength, this.HDWalletPassord);
//       const storedKey = wc.StoredKey.importHDWallet(
//         hdWallet.mnemonic(),
//         name,
//         Buffer.from(this.StoreFixedPassword),
//         this.DefaultCoins[0]
//       );
//       this.DefaultCoins.forEach((coin) => {
//         storedKey.accountForCoin(coin, hdWallet);
//       });
//       let wallet = this.keystore.mapWallet(storedKey);
//       await this.keystore.importWallet(wallet);
//       this.wallet = new StoredKeyWallet(storedKey, await initWasm());
//       console.log(`Wallet ${name} created, mnemonic: ${hdWallet.mnemonic()}`);
//       this.status();
//       return this.wallet;
//     } catch (err) {
//       console.log(`Exception: ${err}`);
//       return null;
//     }
//   }

//   async import(mnemonic: string, name: string): Promise<StoredKeyWallet | null> {
//     this.wallet = null;
//     if (!this.keystore) {
//       return null;
//     }
//     try {
//       if (!wc.Mnemonic.isValid(mnemonic)) {
//         console.error(`Mnemonic is not valid ${mnemonic}`);
//         return null;
//       }
//       if (name === '') {
//         name = this.autoFillName(name);
//       }
//       // There are two ways to do this here:
//       // 1. Create HDWallet with mnemonic, create StoroedKey with it (add coins), then map to a KeyStore wallet and import it into the storage, or
//       // 2. Import in KeyStore directly (using mnemonic), and obtain StoredKey from it
//       let wallet = await this.keystore.import(mnemonic, name, this.StoreFixedPassword, this.DefaultCoins);
//       this.wallet = new StoredKeyWallet(this.keystore.mapStoredKey(wallet), await initWasm());
//       console.log(`Wallet ${name} imported, mnemonic: ${mnemonic}`);
//       this.status();
//       return this.wallet;
//     } catch (err) {
//       console.log(`Exception: ${err}`);
//       return null;
//     }
//   }

//   async addCoin(coin: string): Promise<StoredKeyWallet | null> {
//     if (this.wallet == null) {
//       console.error('No wallet open, see walletCreate() / walletLoad() / walletsList()');
//       return null;
//     }
//     if (!this.keystore) {
//       return null;
//     }
//     const wallet = await this.keystore.addAccounts(this.wallet?.wallet.identifier(), this.StoreFixedPassword, [coin]);
//     this.wallet = new StoredKeyWallet(this.keystore.mapStoredKey(wallet), await initWasm());
//     return this.wallet;
//   }

//   // Delete loaded wallet
//   async delete(param: string): Promise<void> {
//     if (!this.wallet) {
//       console.log(`No wallet loaded`);
//       return;
//     }
//     if (!this.keystore) {
//       return;
//     }
//     try {
//       if (param !== 'delete') {
//         console.log(`Are you sure? Invoke with 'delete' parameter!`);
//         return;
//       }
//       const name = this.wallet.wallet.name();
//       const id = this.wallet.wallet.identifier();
//       await this.keystore.delete(id, this.StoreFixedPassword);
//       this.wallet = null;
//       console.log(`Wallet '${name}' ${id} deleted.`);
//       await this.refreshStoreWallets();
//     } catch (err) {
//       console.log(`Exception: ${err}`);
//     }
//   }

//   async deleteAll(param: string): Promise<void> {
//     await this.refreshStoreWallets();
//     if (this.storeWallets.length == 0) {
//       console.log(`No wallets found`);
//       return;
//     }
//     if (!this.keystore) {
//       return;
//     }
//     try {
//       if (param !== 'deleteall') {
//         console.log(`Are you sure? Invoke with 'deleteall' parameter!`);
//         return;
//       }
//       while (this.storeWallets.length > 0) {
//         const id = this.storeWallets[0].id;
//         await this.keystore.delete(id, this.StoreFixedPassword);
//         await this.refreshStoreWallets();
//       }
//       this.wallet = null;
//       console.log(`All wallets deleted.`);
//     } catch (err) {
//       console.log(`Exception: ${err}`);
//     }
//   }

//   status(): void {
//     if (this.wallet === null) {
//       console.error(
//         `No wallet open, ${this.storeWallets.length} available; see walletCreate() / walletLoad() / walletsList()`
//       );
//     } else {
//       console.error(`Wallet open: ${this.wallet.status()}`);
//     }
//   }

//   dump(): void {
//     this.status();
//     if (this.wallet) {
//       this.wallet.dump();
//     }
//   }
// }

// export { createNewHDWallet, StoredKeyWallet, TestWalletManager };

// // check and try to create store folder
// const pathExists = fs.existsSync(TEST_DIR);
// if (!pathExists) {
//   // try to create, ignore error
//   fs.mkdirSync(TEST_DIR);
// }

// // check again
// if (!fs.existsSync(TEST_DIR)) {
//   throw new Error(`ERROR: Could not open/create storage folder!  Wallet storage will not work.  '${TEST_DIR}'`);
// }

// for (const account of accounts) {
//   if (account.coin !== CHAINS['XRP']?.coinId) {
//     account.balance = 0;
//     continue;
//   }

//   // Use the account information here
//   const response = await xrplClient.getAccountInfo(account.address); // account.address | rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn
//   if (!response) {
//     account.balance = 0;
//   } else {
//     account.balance = Number(response.result.account_data.Balance);
//   }
// }

// /**
//  * Get wallet balance
//  * @param {ActiveAccount[]} accounts
//  * @returns {Promise<ActiveAccount[]>}
//  */
// export const getCryptoWalletBalanceAPI = async (activeAccounts: ActiveAccount[]): Promise<WalletAccounts> => {
//   const xrplClient = new XrpClient();
//   await xrplClient.connect();

//   // Accumulate the account addresses into a single object using the reduce method
//   const accounts = activeAccounts.reduce(async (acc, account) => {
//     const chain = ChainsByCoinId[`${account.coin}`];
//     if (chain !== undefined) {
//       const { currencyCode } = chain;

//       if (currencyCode !== undefined && currencyCode === 'XRP') {
//         let balance = 0;
//         // Use the account information here
//         const response = await xrplClient.getAccountInfo(account.address); // account.address | rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn
//         if (!response) {
//           balance = 0;
//         } else {
//           balance = Number(response.result.account_data.Balance);
//         }

//         acc[currencyCode] = {
//           name: chain.name,
//           address: account.address,
//           coin: account.coin,
//           balance: 0, // TODO: con fetch the balance from the blockchain, but it might make this process slower
//         };
//       }
//     }

//     return acc;
//   }, {} as WalletAccounts);

//   await xrplClient.disconnect();

//   return accounts;
// };
```

## Wallet Deposits and Withdrawals

```typescript
// /*
//    DEPOSITS AND WITHDRAWALS
//  */
// /**
//  * wallet withdrawal by user id
//  * @param {mongoose.Types.ObjectId} userId
//  * @returns {Promise<IHDWalletDoc | null>}
//  */
// export const walletWithdrawalRequest = async (
//   userId: mongoose.Types.ObjectId,
//   walletId: mongoose.Types.ObjectId,
//   walletCurrencyType: string
// ): Promise<IHDWalletDoc | null> => {
//   const user = await getUserById(userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }

//   const wallet = await getCryptoWalletById(walletId);
//   if (!wallet) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
//   }

//   const currency = await getCurrencyByCode(wallet.currencyCode);
//   if (!currency) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Currency not found');
//   }

//   if (currency.currencyType != walletCurrencyType) {
//     //
//   }
//   await wallet.deleteOne();
//   return wallet;
// };

//
//
// add the request to the db and use schedulers to process them later - same for deposits
// but for that to work we have to have our own crypto wallet system
// Withdrawals for fiats and cryptos
// deposits for fiats and cryptos
// CRUD for fiat wallets

//

//     .toLowerCase();
//   const user = await getUserById(walletBody.userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   const currency = await getCurrencyByCode(walletBody.currencyCode);
//   if (!currency) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Unsupported currency');
//   }
//   if (currency.currencyType != allCurrenyTypes.fiat) {
//     currency.name.toLowerCase();
//   }
//   // check if user has reached a certain kyc level
//   // for each currency available create a wallet for the user
//   if (await WALLETS.isExists(walletBody.userId, walletBody.currencyCode)) {
//     throw new ApiError(httpStatus.CONFLICT, 'Wallet already exists');
//   }
//   walletBody = {
//     ...walletBody,
//     currencyType: currency.currencyType,
//   }; // set the currency type
//   return WALLETS.create(walletBody);

// save to database -> use IBlockchainWalletDoc

// /**
//  * add coin to wallet
//  * @param {NewCreatedWallet} walletBody
//  * @returns {Promise<IHDWalletDoc>}
//  */
// export const addCoinToWallet = async (walletBody: NewCreatedHDWallet): Promise<IHDWalletDoc> => {
//   // check if user has an hd wallet before
//   if (!(await CRYPTO_HD_WALLETS.isExists(walletBody.userId, walletBody.walletId))) {
//     const wallet = await createCryptoWalletAPI(walletBody.currencyCode);
//     if (!address) {
//       throw new ApiError(httpStatus.FAILED_DEPENDENCY, 'Error while creating cryptocurrency wallet');
//     }
//   }

//   // check if user has reached a certain kyc level
//   // for each currency available create a wallet for the user
//   // if (await CRYPTO_HD_WALLETS.isExists(walletBody.userId, walletBody.walletId)) {
//   //   throw new ApiError(httpStatus.CONFLICT, 'Wallet already exists');
//   // }

//   return CRYPTO_HD_WALLETS.create(walletBody);
// };

// /**
//  * Get wallet addresses
//  * @param {mongoose.Types.ObjectId} userId
//  * @returns {Promise<QueryResult>}
//  */
// export const getCryptoWalletAddresses = async (userId: mongoose.Types.ObjectId): Promise<IHDWalletAccountsDoc | null> => {
//   const wallet = await getCryptoWalletByUserId(userId);
//   if (!wallet) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
//   }

//   const jsonData: IWalletData = JSON.parse(wallet.data);
//   const addresses = jsonData.activeAccounts; // .map((activeAccount: ActiveAccount) => activeAccount.address);
//   if (addresses.length != 0) {
//     const results: IHDWalletAccountsDoc = {
//       accounts: addresses,
//     };

//     return results;
//   }

//   return null;
// };

// router
//   .route('/fiat/:transactionId/verify')
//   .get(
//     auth(allPermissions.Transactions.Get),
//     validate(fiatTransactionsValidation.getFiatTransaction),
//     fiatTransactionsController.verifyFiatTransaction
//   );
```

### Flutterwave

```typescript
// import axios, { AxiosRequestConfig, Method } from 'axios';
// // import Flutterwave from 'flutterwave-node-v3';
// // import {
// //   GetBillingCategoriesPayload,
// //   BillingCategoryResponse,
// //   ValidateBillingPayload,
// //   ValidateBillResponse,
// //   CreateBillPayload,
// //   CreateBillResponse,
// // } from 'flutterwave-node-v3/services/bills/types';

// // import {
// //   IBillCategoryRequestFilters,
// //   IBillCategoryResponse,
// //   ICreateBillPaymentRequest,
// //   ICreateBillPaymentResponse,
// //   IValidateBillRequest,
// //   IValidateBillResponse,
// // } from './interfaces.api.bill';

// // const flw = new Flutterwave(String(config.flutterwaveAPI.key), String(config.flutterwaveAPI.secret));

// /**
//  * Represents the Flutterwave API.
//  */
// class FlutterwaveQ {
//   private readonly BASE_API_URL: string = 'https://api.flutterwave.com/v3';
//   private readonly publicKey: string;
//   private readonly secretKey: string;

//   /**
//    * Initializes a new instance of the Flutterwave class.
//    * @param key The Flutterwave API key.
//    * @param secret The Flutterwave API secret.
//    */
//   constructor(publicKey: string, secretKey: string) {
//     this.publicKey = publicKey;
//     this.secretKey = secretKey;
//   }

//   private async request(requestMethod: Method, path: string, payload: any) {
//     try {
//       const config: AxiosRequestConfig = {
//         method: requestMethod,
//         url: `${this.BASE_API_URL}/${path}`,
//         headers: {
//           Authorization: `Bearer ${this.secretKey}`,
//           'Content-Type': 'application/json',
//         },
//         data: {
//           country: 'NG',
//           customer: '+23490803840303',
//           amount: '500',
//           recurrence: 'ONCE',
//           type: 'AIRTIME',
//           reference: '9300049404444',
//           biller_name: 'DSTV, MTN VTU, TIGO VTU, VODAFONE VTU, VODAFONE POSTPAID PAYMENT',
//         },
//       };

//       const response = await axios(config);
//       return JSON.stringify(response.data);
//     } catch (error) {
//       throw new Error('');
//     }
//   }

//   /**
//    * Creates a new bill using the Flutterwave API.
//    */
//   public async createBill(payload: CreateBillPayload): Promise<void> {
//     try {
//       const config = {
//         method: 'POST',
//         url: `${this.BASE_API_URL}/bills`,
//         headers: {
//           Authorization: `Bearer ${this.key}`,
//           'Content-Type': 'application/json',
//         },
//         data: {
//           country: 'NG',
//           customer: '+23490803840303',
//           amount: '500',
//           recurrence: 'ONCE',
//           type: 'AIRTIME',
//           reference: '9300049404444',
//           biller_name: 'DSTV, MTN VTU, TIGO VTU, VODAFONE VTU, VODAFONE POSTPAID PAYMENT',
//         },
//       };

//       const response = await axios(config);
//       console.log(JSON.stringify(response.data));
//     } catch (error) {
//       console.error(error);
//     }
//   }
// }

// // Example usage:
// // const flutterwave = new Flutterwave('your_api_key', 'your_api_secret');
// // flutterwave.createBill();

// // export default class Flutterwave {
// //     constructor(public_key: string, secret_key: string, _base_url?: string) {
// //       this.public_key = public_key;
// //       this.secret_key = secret_key;
// //       this._base_url = _base_url;

// //       RaveUtils.emptyCheck(public_key, 'Public Key required');
// //       RaveUtils.emptyCheck(secret_key, 'Secret Key required');

// //       // Override BaseURL
// //       if (_base_url && typeof _base_url === 'string') {
// //         this.base_url = _base_url;
// //       }
// //     }
// //     public_key: string;
// //     secret_key: string;
// //     _base_url?: string;

// //     // var base_url      = 'https://rave-api-v2.herokuapp.com/';
// //     base_url = 'https://api.flutterwave.com/';

// //     // var base_url='https://ravesandboxapi.flutterwave.com';
// //     // var prod_url='https://ravesandboxapi.flutterwave.com'

// //     MORX_DEFAULT = {
// //       throw_error: true,
// //     };

// //     getPublicKey() {
// //       return this.public_key;
// //     }

// //     getSecretKey() {
// //       return this.secret_key;
// //     }

// //     getBaseUrl() {
// //       return this.base_url;
// //     }

// //     setBaseUrl(new_base_url: string) {
// //       if (new_base_url) {
// //         this.base_url = new_base_url;
// //       }
// //     }

// //     request(path: string, payload: any, callback?: Function) {
// //       let requestOptions: RequestOptions = {
// //         uri: path,
// //         baseUrl: '',
// //         method: 'body',
// //         datakey: true,
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Authorization: `Bearer ${this.getSecretKey()}`,
// //         },
// //         json: {},
// //       };

// //       var requestMethod = RaveUtils.initDefaultValue(payload.method, 'POST' || 'PUT');
// //       var datakey: 'body' | 'qs' = requestMethod == 'POST' || 'PUT' ? 'body' : 'qs';
// //       var requestJSON = datakey == 'body' ? true : false;
// //       requestOptions.baseUrl = this.getBaseUrl();
// //       requestOptions.method = requestMethod;
// //       requestOptions[datakey] = RaveUtils.initDefaultValue(payload, {});
// //       //@ts-ignore
// //       requestOptions.json = requestJSON;

// //       if (callback) {
// //         this._makeRequest(requestOptions, callback);
// //         return requestOptions;
// //       } else {
// //         return this._makePromiseRequest(requestOptions);
// //       }
// //     }

// //     encrypt(data: any) {
// //       var encryption_key = Security.getEncryptionKey(this.getSecretKey());
// //       return Security.encrypt(encryption_key, JSON.stringify(data));
// //     }
// //     getIntegrityHash(data: string) {
// //       return Security.getIntegrityHash(data, this.getPublicKey(), this.getSecretKey());
// //     }
// //     _makeRequest(requestOptions: any, callback: Function) {
// //       Request(requestOptions, function (err: any, res: any, body: any) {
// //         if (typeof res == 'undefined') {
// //           res = {};
// //         }

// //         if (typeof body == 'undefined') {
// //           body = {};
// //         }
// //         callback(err, res, body);
// //       });
// //     }

// //     _makePromiseRequest(requestOptions: any) {
// //       var self = this;
// //       return new Promise(function (resolve, reject) {
// //         self._makeRequest(requestOptions, function (err: any, res: any, body: any) {
// //           if (err) {
// //             reject(err);
// //           } else {
// //             //@ts-ignore
// //             resolve(res, body);
// //           }
// //         });
// //       });
// //     }
// //   }

// /**
//  * Buy a new giftcard - Unimplemented
//  * @param {NewCreatedGiftcardOrder} giftcardOrderBody
//  * @returns {Promise<IGiftcardOrderDoc>}
//  */
// export const buyGiftcard = async (giftcardOrderBody: NewCreatedGiftcardOrder): Promise<IGiftcardOrderDoc> => {
//   const user = await getUserById(giftcardOrderBody.userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }

//   const exchange = await getExchangeById(giftcardOrderBody.exchangeId);
//   if (!exchange) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Exchange not found');
//   }

//   // check if the exchange is a giftcard-based exchange
//   if (exchange.type !== allExchangeTypes.giftcard) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Exchange is not a Giftcard-Based Exchange');
//   }

//   /*
//     Start Order
//   */

//   // Create a new order
//   const newGiftcardOrder = await EXCHANGE_GIFTCARD_ORDERS.create(giftcardOrderBody);

// const giftcard = await getGiftcardById(giftcardOrderBody.giftcardId);
// if (!giftcard) {
//   throw new ApiError(httpStatus.NOT_FOUND, 'Giftcard not found');
// }

// // Detect currency wallet
// const currencyWallet = await getCurrencyWalletById(giftcardOrderBody.currencyId);
// if (!currencyWallet) {
//   throw new ApiError(httpStatus.NOT_FOUND, 'Currency Wallet not found');
// }

// // Get giftcard-currency rate
// const giftcardByCurrencyRate = await getGiftcardExchangeRateByCurrencyId(giftcardOrderBody.currencyId);
// if (!giftcardByCurrencyRate) {
//   throw new ApiError(httpStatus.NOT_FOUND, 'Giftcard by Currency Rate not found');
// }

// const rateAmount = giftcardByCurrencyRate.rate;
// const creditAmount = currencyOrderBody.amount * rateAmount;

// // init a new transaction - detect wallet type so as to know where to put the transactions
// const newWalletTransaction = await detectWalletType(
//   user,
//   currencyWallet,
//   currencyOrderBody.amount,
//   allTransactionTypes.sell
// );

// // check if the user has enough amount of baseCurrency to swap for quoteCurrency
// if (currencyWallet.balance < giftcardOrderBody.amount) {
//   // updated transaction status
//   throw new ApiError(httpStatus.PAYMENT_REQUIRED, 'Insufficient Balance in Currency Wallet');
// }

// const newWalletTransaction = await detectWalletType(user, currencyWallet, creditAmount, allTransactionTypes.buy);

// // Deduct the base currency amount from the user and credit the quote currency amount
// baseCurrencyWallet.balance -= currencyOrderBody.amount;
// quoteCurrencyWallet.balance += creditAmount;

// // save wallet updates
// await currencyWallet.save();

// // update transaction - for the deduction in the base currency wallet
// newWalletTransaction.status = allTransactionStatus.processed;
// await newWalletTransaction.save();

// // update order
// newGiftcardOrder.filled = true;
// await newGiftcardOrder.save();

//   return newGiftcardOrder;
// };

// /**
//  * Sell a new giftcard - Unimplemented
//  * @param {NewCreatedGiftcardOrder} giftcardBody
//  * @returns {Promise<IGiftcardOrderDoc>}
//  */
// export const sellGiftcard = async (giftcardBody: NewCreatedGiftcardOrder): Promise<IGiftcardOrderDoc> => {
//   //
//   return EXCHANGE_GIFTCARD_ORDERS.create(giftcardBody);
// };

/**
 * Detect currency transactions
 * @param {NewCreatedCurrencyWallets} currencies - currencies
 * @returns {Promise<IFiatTransactionDoc | ICryptoTransactionDoc>}
 */
const processTransaction = async (
  currencies: NewCreatedCurrencyWallets,
  currencyOrder: ICurrencyOrderDoc
): Promise<IFiatTransactionDoc | ICryptoTransactionDoc> => {
  let currencyOrderAmount: number;

  if (currencies.baseCurrencyType !== 'CRYPTO') {
    const baseCurrencyTransaction: IFiatTransactionDoc = currencies.baseCurrency.transaction as IFiatTransactionDoc;
    const quoteCurrencyTransaction: IFiatTransactionDoc = currencies.quoteCurrency.transaction as IFiatTransactionDoc;
  } else {
    const baseCurrencyTransaction: ICryptoTransactionDoc = currencies.baseCurrency.transaction as ICryptoTransactionDoc;
    const quoteCurrencyTransaction: ICryptoTransactionDoc = currencies.quoteCurrency.transaction as ICryptoTransactionDoc;
  }

  // Check transaction type
  switch (transactionType) {
    case allTransactionTypes.buy:
      currencyOrderAmount = currencyOrder.amount;
      break;

    case allTransactionTypes.sell:
      currencyOrderAmount = -currencyOrder.amount;
      break;

    default:
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Transaction Type not detected');
  }

  const reference = `${generateAlphanumericReference(16)}`;
  switch (currencies.wallet.currencyType) {
    case allCurrenyTypes.fiat:
      let transactionBody: NewCreatedFiatTransaction = {
        userId: user._id,
        walletId: wallet._id,
        amount: currencyOrderAmount,
        type: transactionType,
        referenceId: reference,
        currencyCode: '',
        paymentMethod: '',
      };
      const fiatTransaction = await addNewFiatPaymentTransaction(transactionBody);
      return fiatTransaction;

    case allCurrenyTypes.crypto:
      const transactionBody: NewCreatedCryptoTransaction = {
        userId: user._id,
        walletId: wallet._id,
        amount: currencyOrderAmount,
        type: transactionType,
        reference,
      };
      return addNewCryptoPaymentTransaction(transactionBody);

    default:
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Wallet Currency Type not detected');
  }
};
```

## Codes

```ts
// cryptoWallets: [];
// fiatWallets: [];

// cryptoWallets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CRYPTO_WALLET' }],
// fiatWallets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FIAT_WALLET' }],

// /**
//  * Get the verification status of each field for a KYC user
//  * @param {mongoose.Types.ObjectId} userId
//  * @returns {Promise<FieldVerificationStatus[]>}
//  */
// export const getKycVerificationStatus = async (userId: mongoose.Types.ObjectId): Promise<Boolean[]> => {
//   const kycUser = await getKycUserById(userId);
//   if (!kycUser) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User kyc profile not found');
//   }

//   kycUser.address.status;

//   return kycUser.isComplete;
// };

// import mongoose from 'mongoose';
// import toJSON from '@modules/toJSON/toJSON';
// import paginate from '@modules/paginate/paginate';
// import { IKycVerificationDoc, IKycVerificationModel, status } from '../interfaces/interfaces.verification.kyc';
// import KYC from './model.kyc';

// // Define the possible status values for fields
// const fieldStatusOptions = ['UNINITIATED', 'PENDING', 'FAILED', 'VERIFIED'];

// // Create a function to generate the field status schema
// function createFieldStatusSchema() {
//   const fieldStatusSchema = {};

//   // Loop through each field and add a subfield for its status
//   ['phoneNumber', 'country', 'address', 'documentNumber', 'documentImage', 'userPhoto'].forEach((field) => {
//     fieldStatusSchema[field] = {
//       type: String,
//       enum: fieldStatusOptions,
//       default: 'UNINITIATED',
//     };
//   });

//   return fieldStatusSchema;
// }

// const kycVerificationSchema = new mongoose.Schema<IKycVerificationDoc, IKycVerificationModel>(
//   {
//     kycId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'KYC',
//       required: true,
//     },
//     // Add the subfield for field statuses
//     fieldStatus: createFieldStatusSchema(),
//   },
//   {
//     timestamps: true,
//   }
// );

// // add plugin that converts mongoose to json
// kycVerificationSchema.plugin(toJSON);
// kycVerificationSchema.plugin(paginate);

// kycVerificationSchema.pre('save', async function (next) {
//   const kycVerification = this;

//   // Find the KYC document using kycId
//   const kyc = await KYC.findById(kycVerification.kycId);

//   if (!kyc) {
//     // Handle the case when KYC document is not found
//     return next(new Error('KYC document not found'));
//   }

//   // Define an array of fields to check
//   const fields = ['phoneNumber', 'address', 'country', 'documentNumber', 'documentImage', 'userPhoto'];

//   // Implement verificationStatus based on the current status of each field
//   let fieldStatus: Map<string, status>;

//   fields.forEach((field) => {
//     fieldStatus.set(field, 'UNINITIATED'); // Default status

//     if (typeof kyc[field] === 'string') {
//       // Check the status of the field
//       switch (kycVerification.fieldStatus[field]) {
//         case 'FAILED':
//           break;
//         case 'VERIFIED':
//           fieldStatus[field] = kycVerification.fieldStatus[field];
//           break;
//         default:
//           // Check if the field exists in KYC and is not 'FAILED' or 'VERIFIED'
//           if (
//             kyc[field] &&
//             kycVerification.fieldStatus[field] !== 'FAILED' &&
//             kycVerification.fieldStatus[field] !== 'VERIFIED'
//           ) {
//             fieldStatus[field] = 'PENDING';
//           }
//           break;
//       }
//     }
//   });

//   kycVerification.fieldStatus = fieldStatus;

//   next();
// });

// const KYC_VERIFICATION = mongoose.model<IKycVerificationDoc, IKycVerificationModel>(
//   'KYC_VERIFICATION',
//   kycVerificationSchema
// );

// export default KYC_VERIFICATION;

// <!-- for fiat there has to be a fixed rate set by the admin e.g BTC/NGN 1 BTC = 30 * 10^6 -->
// <!-- function calculateRate(price: number, pricePctDifference: number): number {
//   if (pricePctDifference >= 0) {
//     // Increase price when pricePctDifference is positive or zero
//     return price * (1 + pricePctDifference / 100);
//   }
//   // Reduce price when pricePctDifference is negative
//   return price * (1 - Math.abs(pricePctDifference) / 100);
// } -->

// "dev2": "yarn compile:watch && yarn pre:dev",
// "dev3": "yarn compile && yarn pre:dev",
```
