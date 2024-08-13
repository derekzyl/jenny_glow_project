"use strict";
// import { auth } from '../../auth';
// import { validate } from '../../validate';
// import express, { Router } from 'express';
// import { virtualAccountValidation, virtualSubAccountController } from '..'; // Adjust the paths accordingly
// import { allPermissions } from '../../../config/roles';
// const virtualAccountRouter: Router = express.Router();
// virtualAccountRouter
//   .route('/')
//   .post(
//     auth(allPermissions.VirtualAccounts.Create),
//     validate(virtualAccountValidation.createVirtual),
//     virtualSubAccountController.createVirtualSubAccountController
//   )
//   .get(
//     auth(allPermissions.VirtualAccounts.GetAll),
//     validate(virtualAccountValidation.getAllVirtualSubs),
//     virtualSubAccountController.getAllVirtualSubAccountsController
//   );
// virtualAccountRouter
//   .route('/:id')
//   .get(
//     auth(allPermissions.VirtualAccounts.Get),
//     validate(virtualAccountValidation.virtualFetchById),
//     virtualSubAccountController.getVirtualSubAccountByIdController
//   )
//   .delete(
//     auth(allPermissions.VirtualAccounts.Delete),
//     validate(virtualAccountValidation.virtualFetchById),
//     virtualSubAccountController.deleteVirtualSubAccountByIdController
//   );
// virtualAccountRouter
//   .route('/user/:userId')
//   .get(
//     auth(allPermissions.VirtualAccounts.Get),
//     virtualSubAccountController.getVirtualSubAccountByUserIdController
//   )
//   .delete(
//     auth(allPermissions.VirtualAccounts.Delete),
//     virtualSubAccountController.deleteVirtualSubAccountByUserIdController
//   );
// virtualAccountRouter
//   .route('/balance/')
//   .get(auth(allPermissions.VirtualAccounts.Get), virtualSubAccountController.getSubAccountBalanceByUserIdController);
// virtualAccountRouter
//   .route('/transactions/')
//   .get(auth(allPermissions.VirtualAccounts.Get), virtualSubAccountController.getSubAccountTransactionByUserIdController);
// export default virtualAccountRouter;
//# sourceMappingURL=virtual-sub-account.route.v1.js.map