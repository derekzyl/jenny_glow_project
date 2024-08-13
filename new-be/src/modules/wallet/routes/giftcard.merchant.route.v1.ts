// giftCardMerchant.route.ts
import { auth } from '@modules/auth';
import { Router } from 'express';

import { MULTER_UPLOAD, formFileHandler } from '@modules/utils/file_handler/middleware.file';
import { validate } from '@modules/validate';
import { giftCardMerchantController, giftCardMerchantValidation } from '..';

const router = Router();

router
  .route('/')
  .post(
    auth(/* Add your authentication middleware here */),
    MULTER_UPLOAD.fields([{ name: 'image', maxCount: 1 }]),
    formFileHandler([{ name: 'image' }]),
    /*  validate(giftCardMerchantValidation.addGiftCardMerchant), */
    giftCardMerchantController.addGiftCardMerchant
  )
  .get(
    auth(/* Add your authentication middleware here */),
    validate(giftCardMerchantValidation.getAllGiftCardMerchants),
    giftCardMerchantController.getAllGiftCardMerchants
  );

router
  .route('/:giftCardMerchantId')
  .get(
    auth(/* Add your authentication middleware here */),
    validate(giftCardMerchantValidation.getGiftCardMerchant),
    giftCardMerchantController.getGiftCardMerchant
  )
  .patch(
    auth(/* Add your authentication middleware here */),
    validate(giftCardMerchantValidation.updateGiftCardMerchant),
    MULTER_UPLOAD.fields([{ name: 'image', maxCount: 1 }]),
    formFileHandler([{ name: 'image' }]),
    giftCardMerchantController.updateGiftCardMerchant
  )
  .delete(
    auth(/* Add your authentication middleware here */),
    validate(giftCardMerchantValidation.deleteGiftCardMerchant),
    giftCardMerchantController.deleteGiftCardMerchant
  )
  .put(
    auth(/* Add your authentication middleware here */),
    validate(giftCardMerchantValidation.deactivateGiftCardMerchant),
    giftCardMerchantController.deactivateGiftCardMerchant
  );

export default router;
