"use strict";
// // import { logger } from '../../logger';
// import logger from '../../logger/logger';
// import axios from 'axios';
// import { Address, PrivateKey, Script, Transaction } from 'bitcore-lib';
// class BitcoinClient {
//   private client;
//   private _network: string;
//   constructor(network: string = 'BTC') {
//     this._network = network;
//     this.client = axios.create({
//       baseURL: 'https://chain.so/api/v3',
//       headers: {
//         'Content-type': 'application/json',
//         // set api keys
//       },
//     });
//   }
//   // public async connect(): Promise<void> {
//   //   await this.client.connect();
//   // }
//   static create() {
//     const privateKey = new PrivateKey(undefined, { alias: '', name: '' });
//     const address = privateKey.toAddress();
//     // const keyPair = ECPair.makeRandom();
//     // const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
//     // console.log(address);
//     return { privateKey, address };
//   }
//   static getAddress(privateKey: string): Address {
//     // a default network address from a public key
//     const publicKey = new PrivateKey(privateKey);
//     const address = new Address(publicKey);
//     // alternative interface
//     // const address = Address.fromPublicKey(publicKey);
//     // address.network;
//     return address;
//   }
//   // public async disconnect(): Promise<void> {
//   //   await this.client.disconnect();
//   // }
//   public async getAccountInfo(address: string) {
//     const request = {
//       command: 'account_info',
//       account: address,
//       ledger_index: 'validated',
//     };
//     try {
//       const response = await this.client.get(request);
//       return response;
//     } catch (error) {
//       // throw new Error('')
//       logger.error('error in BitcoinClient => getAccountInfo:', error);
//       return null;
//     }
//   }
//   public async getTransactionDetails(txHash: string) {
//     const request = {
//       command: 'tx',
//       transaction: txHash,
//       binary: false,
//     };
//     const response = await this.client.get(request);
//     return response;
//   }
//   public async getFee() {
//     const request = {
//       command: 'fee',
//     };
//     const response = await this.client.get(request);
//     return response;
//   }
//   public async getServerState() {
//     const request = {
//       command: 'server_state',
//     };
//     const response = await this.client.get(request);
//     return response;
//   }
//   public async sendTransaction(recieverAddress: string, amountToSend: number) {
//     const sochainNetwork = 'BTCTEST';
//     const privateKey = '';
//     const sourceAddress = '';
//     const satoshiToSend = amountToSend * 100000000;
//     let fee = 0;
//     const outputCount = 2;
//     const response = await this.client.get(`/get_tx_unspent/${sochainNetwork}/${sourceAddress}`);
//     const transaction = new Transaction();
//     let totalAmountAvailable = 0;
//     const inputs: Transaction.UnspentOutput[] = [];
//     const utxos = response.data.data.txs;
//     for (const element of utxos) {
//       const utxo: {
//         address: Address;
//         txId: string;
//         outputIndex: number;
//         script: Script;
//         satoshis: number;
//       } = {
//         address: response.data.data.address,
//         txId: element.txid,
//         outputIndex: element.output_no,
//         script: element.script_hex,
//         satoshis: Math.floor(Number(element.value) * 100000000),
//       };
//       inputs.push(new Transaction.UnspentOutput(utxo).toObject());
//       totalAmountAvailable += utxo.satoshis;
//     }
//     const transactionSize = inputs.length * 146 + outputCount * 34 + 10 - inputs.length;
//     // Check if we have enough funds to cover the transaction and the fees assuming we want to pay 20 satoshis per byte
//     fee = transactionSize * 20;
//     if (totalAmountAvailable - satoshiToSend - fee < 0) {
//       throw new Error('Balance is too low for this transaction');
//     }
//     // Set transaction input
//     transaction.from(inputs);
//     // set the recieving address and the amount to send
//     transaction.to(recieverAddress, satoshiToSend);
//     // Set change address - Address to receive the left over funds after transfer
//     transaction.change(sourceAddress);
//     // manually set transaction fees: 20 satoshis per byte
//     transaction.fee(fee);
//     // Sign transaction with your private key
//     transaction.sign(privateKey);
//     // serialize Transactions
//     const serializedTransaction = transaction.serialize();
//     // Send transaction
//     const result = this.client.post('/cryptocurrency/trending/latest', {
//       data: {
//         tx_hex: serializedTransaction,
//       },
//     });
//     return result;
//   }
// }
// export default BitcoinClient;
//# sourceMappingURL=bitcoin.rpc.blockchain.js.map