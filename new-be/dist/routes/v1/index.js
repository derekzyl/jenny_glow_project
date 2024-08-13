import fxV1 from '../../modules/admin/exchangeWallets/routes/route.fx.v1';
import permissionRoutesV1 from '../../modules/admin/Roles/routes/permissions.route.v1';
import rolesRoutesV1 from '../../modules/admin/Roles/routes/roles.route.v1';
import staffsV1 from '../../modules/admin/staff/routes/route.staff.v1';
import statisticsRoutesV1 from '../../modules/admin/statistics/router.statistics.v1';
import systemRoutesV1 from '../../modules/admin/system/route.system.v1';
import authRouteV1 from '../../modules/auth/routes/auth.route.v1';
import billPaymentRoutesV1 from '../../modules/billPayment/routes/bill-payment.route.v1';
import exchangeRoutesV1 from '../../modules/exchange/routes/exchange.route.v1';
import giftcardOrderRoutesV1 from '../../modules/exchange/routes/giftcard.exchange.v1';
import orderRoutesV1 from '../../modules/exchange/routes/order.route.v1';
import kycRouteV1 from '../../modules/kyc/routes/kyc.route.v1';
import notificationRouterV1 from '../../modules/notification/routes/notification.route.v1';
import virtualAccountRouterV1 from '../../modules/subVirtualAccount/routes/virtual-sub-account.route.v1';
import transferRoutesV1 from '../../modules/tranfers/routes/transfers.v1';
import transactionsRoutesV1 from '../../modules/transactions/routes/transactions.route.v1';
import userRouteV1 from '../../modules/user/routes/user.route.v1';
import currencyRoutesV1 from '../../modules/wallet/routes/currency.route.v1';
import giftcardMerchantRoutesV1 from '../../modules/wallet/routes/giftcard.merchant.route.v1';
import giftcardRoutesV1 from '../../modules/wallet/routes/giftcard.routes.v1';
import beneficiaryRoutesV1 from '../../modules/beneficiaries/routes/beneficiary.route.v1';
import chatRoutesV1 from '../../modules/chat/routes/chat.route.v1';
import referralRoutesV1 from '../../modules/referral/routes/referral.route.v1';
import walletRoutesV1 from '../../modules/wallet/routes/wallet.route.v1';
import webhookRouterV1 from '../../modules/webhooks/webhook.route.v1';
import express from 'express';
import config from '../../config/config';
import devRoute from './dev.route.v1';
const routerV1 = express.Router();
/* The `defaultIRoute` constant is an array of objects that represent the default routes in the
application. Each object in the array has two properties: `path` and `route`. */
const defaultIRoute = [
    {
        path: '/',
        route: authRouteV1,
    },
    {
        path: '/auth',
        route: authRouteV1,
    },
    {
        path: '/users',
        route: userRouteV1,
    },
    {
        path: '/kyc',
        route: kycRouteV1,
    },
    {
        path: '/currencies',
        route: currencyRoutesV1,
    },
    {
        path: '/wallets',
        route: walletRoutesV1,
    },
    {
        path: '/orders',
        route: orderRoutesV1,
    },
    {
        path: '/giftcard-orders',
        route: giftcardOrderRoutesV1,
    },
    {
        path: '/exchange',
        route: exchangeRoutesV1,
    },
    {
        path: '/transactions',
        route: transactionsRoutesV1,
    },
    {
        path: '/bills',
        route: billPaymentRoutesV1,
    },
    {
        path: '/virtual-accounts',
        route: virtualAccountRouterV1,
    },
    {
        path: '/staffs',
        route: staffsV1,
    },
    {
        path: '/fx',
        route: fxV1,
    },
    {
        path: '/giftcards',
        route: giftcardRoutesV1,
    },
    {
        path: '/giftcard-merchants',
        route: giftcardMerchantRoutesV1,
    },
    {
        path: '/transfer',
        route: transferRoutesV1,
    },
    {
        path: '/roles',
        route: rolesRoutesV1,
    },
    {
        path: '/permissions',
        route: permissionRoutesV1,
    },
    {
        path: '/system',
        route: systemRoutesV1,
    },
    {
        path: '/webhook',
        route: webhookRouterV1,
    },
    {
        path: '/notification',
        route: notificationRouterV1,
    },
    {
        path: '/statistics',
        route: statisticsRoutesV1,
    },
    {
        path: '/chats',
        route: chatRoutesV1,
    },
    {
        path: '/beneficiary',
        route: beneficiaryRoutesV1,
    },
    {
        path: '/referral',
        route: referralRoutesV1,
    },
];
const devIRoute = [
    // IRoute available only in development mode
    {
        path: '/test',
        route: devRoute,
    },
];
// paypad.onrender.com/api/v1/webhook/creating-verify-webhook-trans-will-make-necessary-changes-in-the-future
/* `(route) => {
  routerV1.use(route.path, route.route);
}` is a callback function that is being passed to the `forEach` method. */
defaultIRoute.forEach((route) => {
    routerV1.use(route.path, route.route);
});
/* The `if (config.env === 'development') {` statement is checking if the environment variable
`config.env` is set to `'development'`. If it is, then it executes the code block inside the `if`
statement. This code block adds additional routes to the `routerV1` router object for development
purposes. */
if (config.env === 'development') {
    /* `(route) => {
        routerV1.use(route.path, route.route);
    }` is a callback function that is being passed to the `forEach` method. It is used to iterate over
    each object in the `defaultIRoute` array and register the corresponding route with the `routerV1`
    router object. */
    devIRoute.forEach((route) => {
        routerV1.use(route.path, route.route);
    });
}
export default routerV1;
//# sourceMappingURL=index.js.map