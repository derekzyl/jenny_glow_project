import { ApiError } from '../../errors';
import { notificationService } from '../../notification';
import { GeneratePrefixType, GeneratekeyE, generateAlphanumericReference } from '../../utils/referenceGenerator';
import { fiatWalletService, giftCardService } from '../../wallet';
import httpStatus from 'http-status';
import { refBonusService, refService } from '../../referral';
import { allPermissions } from '../../setting/roles';
import EXCHANGE_GIFTCARD_ORDERS from '../models/model.giftcard.order.exchange';
import { getFirstExchange } from './service.engine.exchange';
// create an order,
export async function createGiftCardExchange(payload) {
    const checkPinAvailable = await EXCHANGE_GIFTCARD_ORDERS.findOne({ cardPin: payload.cardPin });
    const getExchange = await getFirstExchange();
    if (!getExchange) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No exchange engine found');
    }
    if (checkPinAvailable) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Card is already used');
    }
    const getGiftcard = await giftCardService.getGiftcardById(payload.giftCardId);
    if (!getGiftcard) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Giftcard not found');
    }
    const newExchange = {
        userId: payload.userId,
        cardPin: payload.cardPin,
        giftCardId: payload.giftCardId,
        ref: generateAlphanumericReference(16, GeneratekeyE.alphanum, GeneratePrefixType.GIFT_CARD),
        exchangeId: getExchange._id,
        amountInUSD: getGiftcard.amount * getGiftcard.rateInUSD,
        expectedCreditAmount: getGiftcard.amount * getGiftcard.rateInUSD * getExchange.localExchangeRateToUsd,
    };
    const newOrder = await EXCHANGE_GIFTCARD_ORDERS.create(newExchange);
    notificationService.sendNotificationToStaffs({
        body: ` incoming giftcard order ${newExchange.ref} by ${newExchange.userId}`,
        title: 'New Giftcard Order',
        type: 'giftcard',
        permissions: [allPermissions.GiftCards.ApproveGiftCard, allPermissions.GiftCards.transactGiftCard],
    });
    notificationService.sendNotification({
        body: ` your giftcard order with ref ${newExchange.ref} has been created \n and its being processed`,
        type: 'giftcard',
        title: 'New Giftcard  order',
        nType: 'both',
        userId: payload.userId,
    });
    return newOrder;
}
export async function creditGiftCard(payload) {
    var _a, _b;
    const findOrder = await EXCHANGE_GIFTCARD_ORDERS.findById(payload.orderId);
    if (!findOrder) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Order not found');
    }
    if (findOrder.filled) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Order is already completed');
    }
    const getGiftcard = await giftCardService.getGiftcardById(findOrder.giftCardId);
    if (!getGiftcard) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Giftcard not found');
    }
    findOrder.creditAmount = payload.amount;
    findOrder.orderStatus = 'PROCESSING';
    findOrder.handledBy = payload.userId;
    const findFiat = await fiatWalletService.getFiatWalletByUserIdAndCurrencyCode(findOrder.userId, 'NGN');
    if (!findFiat) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Fiat wallet not found');
    }
    const creditFiat = await fiatWalletService.exchangeFiat(findFiat, 'NGN', payload.amount, 'RECEIVE');
    // find ref service
    const getRef = await refService.getReferralByUserId(findOrder.userId);
    if (!getRef)
        throw new ApiError(httpStatus.BAD_REQUEST, 'Referral not found');
    if (creditFiat.isComplete) {
        findOrder.orderStatus = (_a = creditFiat.status) !== null && _a !== void 0 ? _a : 'FAILED';
        findOrder.filled = (_b = creditFiat.isComplete) !== null && _b !== void 0 ? _b : false;
        if (getRef.refBy) {
            // create ref bonus
            await refBonusService.createRefBonus({
                bonus: getGiftcard.refBonus,
                details: 'gift card bonus from your referral ',
                referral: getRef.userId,
                type: 'GIFTCARD',
                userId: getRef.refBy,
            });
        }
    }
    notificationService.sendNotification({
        body: ` your giftcard order with ref ${findOrder.ref} has been processed`,
        type: 'giftcard',
        title: 'Completed Giftcard  order',
        nType: 'both',
        userId: findOrder.userId,
    });
    await findOrder.save();
    return findOrder;
}
export async function getGiftCardOrders(filter, options) {
    const getOrders = await EXCHANGE_GIFTCARD_ORDERS.paginate(filter, options);
    return getOrders;
}
export async function getGiftCardOrderById(id) {
    const getOrder = await EXCHANGE_GIFTCARD_ORDERS.findById(id);
    return getOrder;
}
export async function getGiftCardOrdersByUserId(userId, options) {
    const getOrders = await EXCHANGE_GIFTCARD_ORDERS.paginate({ userId }, options);
    return getOrders;
}
export async function deleteGiftCardOrderById(id) {
    await EXCHANGE_GIFTCARD_ORDERS.findByIdAndDelete(id);
    return true;
}
export async function updateGiftCardOrderByUser(id, payload) {
    let newPayload = {};
    if (payload.giftCardId) {
        const getExchange = await getFirstExchange();
        if (!getExchange) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'No exchange engine found');
        }
        const getGiftcard = await giftCardService.getGiftcardById(payload.giftCardId);
        if (!getGiftcard) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Giftcard not found');
        }
        newPayload = {
            amountInUSD: getGiftcard.amount * getGiftcard.rateInUSD,
            expectedCreditAmount: getGiftcard.amount * getGiftcard.rateInUSD * getExchange.localExchangeRateToUsd,
        };
    }
    const getOrder = await getGiftCardOrderById(id.id);
    if (!getOrder) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Order not found');
    }
    if (getOrder.filled) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Order is already settled');
    }
    if (getOrder.creditAmount) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Order is already credited');
    }
    if (getOrder.orderStatus !== 'PENDING')
        throw new ApiError(httpStatus.BAD_REQUEST, 'Order is attended to');
    const updateOrder = await EXCHANGE_GIFTCARD_ORDERS.findOneAndUpdate({ userId: id.userId, _id: id.id }, Object.assign(Object.assign({}, payload), newPayload), { new: true });
    return updateOrder;
}
export async function updateGiftCardOrderById(id, payload, handledBy) {
    const getOrder = await getGiftCardOrderById(id);
    if (!getOrder) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Order not found');
    }
    if (getOrder.filled) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Order is already settled');
    }
    if (getOrder.creditAmount) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Order is already credited');
    }
    let newPayload = {};
    if (payload.giftCardId) {
        const getExchange = await getFirstExchange();
        if (!getExchange) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'No exchange engine found');
        }
        const getGiftcard = await giftCardService.getGiftcardById(payload.giftCardId);
        if (!getGiftcard) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Giftcard not found');
        }
        newPayload = {
            amountInUSD: getGiftcard.amount * getGiftcard.rateInUSD,
            expectedCreditAmount: getGiftcard.amount * getGiftcard.rateInUSD * getExchange.localExchangeRateToUsd,
        };
    }
    const updateOrder = await EXCHANGE_GIFTCARD_ORDERS.findByIdAndUpdate(id, Object.assign(Object.assign(Object.assign({}, payload), newPayload), { handledBY: handledBy }), { new: true });
    return updateOrder;
}
//# sourceMappingURL=service.order.giftcard.js.map