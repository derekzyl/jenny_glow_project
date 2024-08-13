// routes/giftCardOrderRoutes.ts
import { auth } from '../../auth';
import { validate } from '../../validate';
import express from 'express';
// Make sure to import the giftCardController
import { exchangeGiftCardController, exchangeGiftCardValidation } from '..';
import { allPermissions } from '../../setting/roles';
const router = express.Router();
router
    .route('/')
    .post(auth(allPermissions.Users.UserOnly), validate(exchangeGiftCardValidation.createGiftCardOrder), exchangeGiftCardController.createGiftCardOrder)
    .get(auth(allPermissions.GiftCards.GetRate), validate(exchangeGiftCardValidation.getGiftCardOrders), exchangeGiftCardController.getAllGiftCardOrders);
router
    .route('/:orderId')
    .get(auth(allPermissions.GiftCards.GetRate), validate(exchangeGiftCardValidation.getGiftCardOrder), exchangeGiftCardController.getGiftCardOrder)
    .patch(auth(allPermissions.GiftCards.transactGiftCard), validate(exchangeGiftCardValidation.updateGiftCardOrder), exchangeGiftCardController.updateGiftCardOrder)
    .delete(auth(allPermissions.GiftCards.transactGiftCard), validate(exchangeGiftCardValidation.deleteGiftCardOrder), exchangeGiftCardController.deleteGiftCardOrder);
router.route('/credit/:orderId').post(auth(allPermissions.GiftCards.transactGiftCard), // Adjust permissions as needed
validate(exchangeGiftCardValidation.creditGiftCardOrder), exchangeGiftCardController.creditGiftCardOrder);
router
    .route('/user/:orderId')
    .put(auth(allPermissions.GiftCards.GetRate), validate(exchangeGiftCardValidation.updateGiftCardOrderByUser), exchangeGiftCardController.updateGiftCardOrderUser);
router.route('/users/all').get(auth(allPermissions.GiftCards.GetRate), // Adjust permissions as needed
exchangeGiftCardController.getGiftCardOrdersByUser);
export default router;
//# sourceMappingURL=giftcard.exchange.v1.js.map