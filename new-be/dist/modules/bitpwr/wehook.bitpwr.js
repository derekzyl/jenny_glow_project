/* eslint-disable @typescript-eslint/no-use-before-define */
// Define a union type for all possible event types
import { exchangeOrderService } from '../exchange';
import { getFirstExchange } from '../exchange/services/service.engine.exchange';
import { logger } from '../logger';
import { notificationService } from '../notification';
import { sendNotification } from '../notification/service.notification';
import { refBonusService, refService } from '../referral';
import { addNewCryptoPaymentTransaction } from '../transactions/services/service.crypto.transactions';
import { generateReference } from '../utils';
import { generateUUID } from '../utils/referenceGenerator';
import { cryptoWalletService, fiatWalletService } from '../wallet';
import { exchangeFiat } from '../wallet/services/service.fiat.wallet';
import config from '../../config/config';
import { transactionTypes } from '../../config/transactions';
import { FiatCurrencyCodes, cryptoCurrencyCodes } from '../setting/currencies';
// Generic function to handle all transaction events
export async function handleBitpwrTransactionEvent(event) {
    logger.info('Received webhook event from Bitpwr:', event.event);
    switch (event.event) {
        case 'transaction.incoming':
            handleIncomingTransaction(event.data);
            break;
        case 'transaction.awaiting_confirmation':
            handleAwaitingConfirmationTransaction(event.data);
            break;
        case 'transaction.success':
            handleSuccessTransaction(event.data);
            break;
        case 'transaction.failed':
            handleFailedTransaction(event.data);
            break;
        case 'transaction.new':
            handleNewTransaction(event.data);
            break;
        default:
        // Handle unknown event type
    }
}
// Functions to handle each specific event type
export async function handleIncomingTransaction(data) {
    // for this what we are doing is just creating notification for the user that he has a new transaction
    if (data.subAccountId) {
        const getAccount = await cryptoWalletService.getSubAccountByUid(data.subAccountId);
        if (!getAccount) {
            await notificationService.sendNotificationToStaffs({
                body: `a notification from bitpwr but ${data.subAccountId} is not found: the data details is ${JSON.stringify(data)}`,
                title: 'SUB ACCOUNT ERROR',
                type: 'error',
                nType: 'both',
                permissions: ['ALL_STAFFS'],
            });
            return;
        }
        const transactionBody = {
            userId: getAccount.userId,
            walletId: getAccount.userId,
            type: transactionTypes.cryptoTransfer,
            uid: generateUUID(),
            assetType: data.assetType,
            chain: data.chain,
            fee: '0',
            description: "You've received crypto",
            referenceId: `C-${new Date().getFullYear()}-${generateReference(16)}`,
            amount: data.amount,
            fromAddress: data.address,
            network: data.chain,
            ref: data.ref,
            toAddress: data.address,
            status: data.status,
        };
        await sendNotification({
            body: ` You received 
    ${data.amount} ${data.assetType} to ${data.address} \n Transaction ID: ${transactionBody.uid}, Reference ID: ${transactionBody.referenceId} \n Status: ${data.status}`,
            nType: 'both',
            title: ' Crypto Withdrawal',
            userId: getAccount.userId,
            type: 'crypto withdrawal',
        });
        await addNewCryptoPaymentTransaction(transactionBody);
    }
}
export async function handleAwaitingConfirmationTransaction(data) {
    // Implementation for 'transaction.awaiting_confirmation' event
    logger.info('Handling awaiting confirmation transaction:', data);
}
/**
 * The function `handleSuccessTransaction` processes successful transaction events by checking and
 * updating currency exchange orders based on various conditions.
 *
 * @param data The `handleSuccessTransaction` function you provided seems to handle various scenarios
 * related to currency exchange orders based on the `data` parameter of type
 * `TransactionSuccessEvent['data']`.
 *
 * @return The function `handleSuccessTransaction` returns either after sending notifications for
 * errors or after processing and updating the order details based on certain conditions related to the
 * transaction status and currency types involved.
 */
export async function handleSuccessTransaction(data) {
    // lets check the type of currency first either by admin ref or  ref
    let getOrderFromRef;
    let isAdminRef = false;
    const orderFromRef = await exchangeOrderService.getCurrencyExchangeOrderByRef(data.ref);
    if (orderFromRef) {
        getOrderFromRef = orderFromRef;
    }
    else {
        const orderFromAdminRef = await exchangeOrderService.getOrderByReference({ isAdminRef: true, reference: data.ref });
        if (orderFromAdminRef) {
            getOrderFromRef = orderFromAdminRef;
            isAdminRef = true;
        }
        else {
            await notificationService.sendNotificationToStaffs({
                body: `a admin notification from bitpwr  is not found: the data details is ${JSON.stringify(data)}`,
                title: 'SUB ACCOUNT Admin ERROR',
                type: 'error',
                nType: 'both',
                permissions: ['ALL_STAFFS'],
            });
            return;
        }
    }
    const exchange = await getFirstExchange();
    if (!exchange) {
        return;
    }
    // Implementation for 'transaction.success' event
    if (!getOrderFromRef) {
        await notificationService.sendNotificationToStaffs({
            body: `a notification from bitpwr is not found: the data details is ${JSON.stringify(data)}`,
            title: 'SUB ACCOUNT ERROR',
            type: 'error',
            nType: 'both',
            permissions: ['ALL_STAFFS'],
        });
        return;
    }
    const fiatTypes = Object.values(FiatCurrencyCodes);
    //  'SUCCESS' | 'AWAITING_CONFIRMATION' | 'FAILED' | 'PENDING';
    if (getOrderFromRef.filled ||
        (String(getOrderFromRef.status).toUpperCase() === 'SUCCESS' &&
            String(getOrderFromRef.adminStatus).toUpperCase() === 'SUCCESS') ||
        String(getOrderFromRef.status).toUpperCase() === 'FAILED' ||
        String(getOrderFromRef.adminStatus).toUpperCase() === 'FAILED')
        return;
    if (cryptoCurrencyCodes.includes(getOrderFromRef.baseCurrencyCode) &&
        cryptoCurrencyCodes.includes(getOrderFromRef.quoteCurrencyCode)) {
        if (String(getOrderFromRef.status).toUpperCase() === 'PENDING' &&
            getOrderFromRef.baseCurrencySent === false &&
            getOrderFromRef.filled === false &&
            String(getOrderFromRef.adminStatus).toUpperCase() === 'PENDING' &&
            !isAdminRef) {
            const getWallet = await cryptoWalletService.getUserWalletById(getOrderFromRef.quoteCurrencyId);
            if (!getWallet) {
                await notificationService.sendNotificationToStaffs({
                    body: `getWallet not found ${JSON.stringify(data)}  order details is: ${JSON.stringify(getOrderFromRef.toObject())}`,
                    title: 'bit power web hook error occurred fetching wallet',
                    type: 'error',
                    nType: 'both',
                    permissions: ['ALL_STAFFS'],
                });
                return;
            }
            getOrderFromRef.baseCurrencySent = true;
            getOrderFromRef.status = data.status;
            await getOrderFromRef.save();
            const order = await cryptoWalletService.exchangeCrypto(getWallet, getOrderFromRef.quoteCurrencyCode, getOrderFromRef.creditAmount, 'RECEIVE');
            const getRef = await refService.getReferralByUserId(getOrderFromRef.userId);
            const bonus = (exchange.localExchangeRateToUsd * getOrderFromRef.fee * 10) / 100;
            if (getRef && getRef.refBy) {
                // create ref bonus
                await refBonusService.createRefBonus({
                    bonus,
                    details: 'swap bonus from your referral ',
                    referral: getRef.userId,
                    type: 'SWAP',
                    userId: getRef.refBy,
                });
            }
            if (!order) {
                await notificationService.sendNotificationToStaffs({
                    body: `a notification from bitpwr is not found: the data details is ${JSON.stringify(data)}  order details is: ${JSON.stringify(getOrderFromRef.toObject())}`,
                    title: 'webhook failed when trying to swap',
                    type: 'error',
                    nType: 'both',
                    permissions: ['ALL_STAFFS'],
                });
                return;
            }
            if (String(order.status).toLowerCase() === 'success') {
                getOrderFromRef.adminStatus = order.data.status;
                getOrderFromRef.adminUid = order.data.uid;
                getOrderFromRef.adminRef = order.data.ref;
                getOrderFromRef.adminChain = order.data.chain;
                getOrderFromRef.quoteCurrencyReceived = true;
                await getOrderFromRef.save();
            }
        }
        else if (String(getOrderFromRef.status).toUpperCase() === 'SUCCESS' &&
            String(getOrderFromRef.adminStatus).toUpperCase() === 'PENDING' &&
            getOrderFromRef.filled === false &&
            isAdminRef) {
            getOrderFromRef.status = data.status;
            getOrderFromRef.adminStatus = data.status;
            getOrderFromRef.filled = true;
            await getOrderFromRef.save();
        }
    }
    // what happens here is that its assumes that the fiat has been sent and immediately
    // the crypto was sent we are just comfirming crypto being sent
    else if (fiatTypes.includes(getOrderFromRef.baseCurrencyCode) &&
        cryptoCurrencyCodes.includes(getOrderFromRef.quoteCurrencyCode)) {
        if (String(getOrderFromRef.status).toUpperCase() === 'COMPLETE' &&
            getOrderFromRef.baseCurrencySent === true &&
            getOrderFromRef.filled === false &&
            String(getOrderFromRef.adminStatus).toUpperCase() === 'PENDING' &&
            isAdminRef) {
            getOrderFromRef.baseCurrencySent = true;
            getOrderFromRef.status = data.status;
            getOrderFromRef.filled = true;
            getOrderFromRef.adminStatus = data.status;
            getOrderFromRef.quoteCurrencyReceived = true;
            await getOrderFromRef.save();
        }
    }
    else if (cryptoCurrencyCodes.includes(getOrderFromRef.baseCurrencyCode) &&
        fiatTypes.includes(getOrderFromRef.quoteCurrencyCode)) {
        if (String(getOrderFromRef.status).toUpperCase() === 'PENDING' &&
            getOrderFromRef.baseCurrencySent === false &&
            getOrderFromRef.filled === false &&
            String(getOrderFromRef.adminStatus).toUpperCase() === 'PENDING' &&
            !isAdminRef) {
            const getWallet = await fiatWalletService.getFiatWalletById(getOrderFromRef.quoteCurrencyId);
            if (!getWallet)
                return;
            getOrderFromRef.baseCurrencySent = true;
            getOrderFromRef.status = data.status;
            const sendFiat = await exchangeFiat(getWallet, getOrderFromRef.quoteCurrencyCode, getOrderFromRef.creditAmount, 'RECEIVE');
            const getRef = await refService.getReferralByUserId(getOrderFromRef.userId);
            const bonus = (exchange.localExchangeRateToUsd * getOrderFromRef.fee * 10) / 100;
            if (getRef && getRef.refBy) {
                // create ref bonus
                await refBonusService.createRefBonus({
                    bonus,
                    details: 'swap bonus from your referral ',
                    referral: getRef.userId,
                    type: 'SWAP',
                    userId: getRef.refBy,
                });
            }
            if (sendFiat.isComplete) {
                getOrderFromRef.adminStatus = sendFiat.status;
                getOrderFromRef.adminUid = sendFiat.uid;
                getOrderFromRef.adminRef = sendFiat.ref;
                getOrderFromRef.quoteCurrencyReceived = true;
            }
            await getOrderFromRef.save();
        }
    }
}
export async function handleFailedTransaction(data) {
    // Implementation for 'transaction.failed' event
    console.log('Handling failed transaction:', data);
}
export async function handleNewTransaction(data) {
    // Implementation for 'transaction.new' event
    console.log('Handling new transaction:', data);
}
export function isBitPwrWebhookValid(payload) {
    if (!payload) {
        return false; // x-webhook-secret header is missing
    }
    const decodedWebhookSecret = Buffer.from(payload, 'base64').toString();
    logger.info(`decodedWebhookSecret ${decodedWebhookSecret}, config.bitpwr.webhookSecret  ${config.bitpwr.webhookSecret}`);
    return decodedWebhookSecret === config.bitpwr.webhookSecret;
}
//# sourceMappingURL=wehook.bitpwr.js.map