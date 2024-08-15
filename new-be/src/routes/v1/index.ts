import permissionRoutesV1 from '@modules/admin/Roles/routes/permissions.route.v1';
import rolesRoutesV1 from '@modules/admin/Roles/routes/roles.route.v1';
import staffsV1 from '@modules/admin/staff/routes/route.staff.v1';
import statisticsRoutesV1 from '@modules/admin/statistics/router.statistics.v1';
import systemRoutesV1 from '@modules/admin/system/route.system.v1';
import authRouteV1 from '@modules/auth/routes/auth.route.v1';
import notificationRouterV1 from '@modules/notification/routes/notification.route.v1';
import transactionsRoutesV1 from '@modules/transactions/routes/transactions.route.v1';


import adminRouter from '@modules/admin/index.admin';
import chatRoutesV1 from '@modules/chat/routes/chat.route.v1';
import inventoryRouter from '@modules/inventory/route.inventory';
import { productRouter, productVariantRouter } from '@modules/product/main_product/route.product';
import referralRoutesV1 from '@modules/referral/routes/referral.route.v1';
import { reviewRouter } from '@modules/review/main_review/route.review';
import { stockRouter, stockTransferRouter } from '@modules/stock/routes';
import userRouter from '@modules/user/index.user';


import express, { Router } from 'express';
import config from '../../config/config';
import devRoute from './dev.route.v1';

const routerV1 = express.Router();

/* The `interface IRoute` is defining a structure for an object that represents a route in the
application. It has two properties: `path` which represents the URL path for the route, and `route`
which represents the router object for that route. This interface is used to define an array of
routes in the code, where each route is an object that conforms to the `IRoute` interface. */
interface IRoute {
  path: string;
  route: Router;
}

/* The `defaultIRoute` constant is an array of objects that represent the default routes in the
application. Each object in the array has two properties: `path` and `route`. */
const defaultIRoute: IRoute[] = [
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
    route: userRouter,
  },
  {
    path: '/product',
    route: productRouter,
  },

  {
    path: '/inventory',
    route: inventoryRouter,
  },
  {
    path: '/product-variant',
    route: productVariantRouter,
  },
  {
    path: '/admin',
    route: adminRouter,
  },
  {
    path: '/transactions',
    route: transactionsRoutesV1,
  },
  {
    path: '/stock',
    route: stockRouter,
  },
  {
    path: '/stock-transfer',
    route:stockTransferRouter,
  },
  {
    path: '/staffs',
    route: staffsV1,
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
    path: '/review',
    route: reviewRouter,
  },
  {
    path: '/referral',
    route: referralRoutesV1,
  },
];

const devIRoute: IRoute[] = [
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
