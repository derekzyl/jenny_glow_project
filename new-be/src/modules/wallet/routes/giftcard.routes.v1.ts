// giftcard.wallet.route.ts
import { auth } from '@modules/auth';
import { allPermissions } from '@modules/setting/roles';
import { validate } from '@modules/validate';
import { Router } from 'express';
import { giftCardController, giftCardValidation } from '..';

const router = Router();

router
  .route('/')
  .post(auth(allPermissions.SuperAdmin), validate(giftCardValidation.addGiftcard), giftCardController.addGiftcard)
  .get(
    auth(/* Add your authentication middleware here */),
    validate(giftCardValidation.getAllGiftcards),
    giftCardController.getAllGiftcards
  );
router.route('/:merchantId/all').get(giftCardController.getGiftcardsByMerchantId);
router
  .route('/:giftcardId')
  .get(
    auth(/* Add your authentication middleware here */),
    validate(giftCardValidation.getGiftcard),
    giftCardController.getGiftcard
  )
  .patch(auth(allPermissions.SuperAdmin), validate(giftCardValidation.updateGiftcard), giftCardController.updateGiftcard)
  .delete(auth(allPermissions.SuperAdmin), validate(giftCardValidation.deleteGiftcard), giftCardController.deleteGiftcard)
  .put(
    auth(allPermissions.SuperAdmin),
    validate(giftCardValidation.deactivateGiftcard),
    giftCardController.deactivateGiftcard
  );

export default router;
