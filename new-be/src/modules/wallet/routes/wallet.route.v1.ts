import { auth } from '@modules/auth';
import { validate } from '@modules/validate';
import express, { Router } from 'express';
import { cryptoWalletController, cryptoWalletValidation, fiatWalletController, fiatWalletValidation } from '..';
import { allPermissions } from '../../setting/roles';

const router: Router = express.Router();

/*
  Cryptocurrency Wallets
*/
// router
//   .route('/crypto')
//   .get(auth(allPermissions.Wallets.Get), cryptoWalletController.getCryptoWallet)
//   .post(
//     auth(allPermissions.Wallets.Create),
//     validate(cryptoWalletValidation.createDepositAddressRequest),
//     cryptoWalletController.createNewWallet
//   );

/*
  Fiat Wallets
*/

/*
  Cryptocurrency Wallets
*/
router
  .route('/')
  .get(
    auth(allPermissions.Wallets.Get),
    validate(cryptoWalletValidation.getCryptoWalletsValidation),
    cryptoWalletController.getAllUserWallets
  );

router
  .route('/crypto')
  .post(
    auth(allPermissions.Wallets.Create),
    validate(cryptoWalletValidation.createNewWalletValidation),
    cryptoWalletController.createNewWallet
  )
  .get(
    auth(allPermissions.Wallets.Manage),
    validate(cryptoWalletValidation.getCryptoWalletsValidation),
    cryptoWalletController.getCryptoWallets
  );

router
  .route('/crypto/withdraw')
  .post(
    auth(allPermissions.Wallets.Get),
    validate(cryptoWalletValidation.withdrawRequestValidation),
    cryptoWalletController.withdrawCrypto
  );

router
  .route('/crypto/main-account')
  .get(
    auth(allPermissions.Wallets.Manage),
    validate(cryptoWalletValidation.getMainAccountValidation),
    cryptoWalletController.getMainAccount
  );

router
  .route('/crypto/user/all')
  .get(
    auth(allPermissions.Wallets.Get),
    validate(cryptoWalletValidation.getCryptoWalletsByUserIdValidation),
    cryptoWalletController.getCryptoWalletsByUserId
  );
router.route('/crypto/user/balance').get(
  auth(allPermissions.Wallets.Get),
  /* validate(cryptoWalletValidation.getCryptoWalletsByUserIdValidation), */
  cryptoWalletController.getCryptoCumulativeBalance
);

router
  .route('/crypto/update/:walletId')
  .patch(
    auth(allPermissions.Wallets.Get),
    validate(cryptoWalletValidation.updateCryptoWalletByIdValidation),
    cryptoWalletController.updateCryptoWalletById
  );

router
  .route('/crypto/delete/:walletId')
  .delete(
    auth(allPermissions.Wallets.Get),
    validate(cryptoWalletValidation.deleteCryptoWalletByIdValidation),
    cryptoWalletController.deleteCryptoWalletById
  );

router
  .route('/crypto/address/:address')
  .get(
    auth(allPermissions.Wallets.Manage),
    validate(cryptoWalletValidation.getWalletByWalletAddressValidation),
    cryptoWalletController.getWalletByWalletAddress
  );

router
  .route('/crypto/user-wallet/:walletId')
  .get(
    auth(allPermissions.Wallets.Get),
    validate(cryptoWalletValidation.getUserWalletByIdValidation),
    cryptoWalletController.getUserWalletById
  );

/*
  Fiat Wallets
*/
router
  .route('/fiat')
  .post(
    auth(allPermissions.Wallets.Create),
    validate(fiatWalletValidation.createFiatWallet),
    fiatWalletController.createNewFiatWallet
  )
  .get(auth(allPermissions.Wallets.Get), fiatWalletController.getAllUserFiatWallets);

router.route('/fiat/query').get(
  auth(allPermissions.Wallets.Get),

  fiatWalletController.queryCurrencyFiatWallets
);

router
  .route('/fiat/user/all')
  .get(
    auth(allPermissions.Wallets.Get),
    validate(fiatWalletValidation.getFiatWalletsByUserId),
    fiatWalletController.getFiatWalletsByUserId
  );

router
  .route('/fiat/user/currency/:currencyCode')
  .get(
    auth(allPermissions.Wallets.Get),
    validate(fiatWalletValidation.getFiatWalletByUserIdAndCurrencyCode),
    fiatWalletController.getFiatWalletByUserIdAndCurrencyCode
  );

router
  .route('/fiat/exchange/:currencyCode')
  .get(
    auth(allPermissions.Wallets.Get),
    validate(fiatWalletValidation.getExchangeFiatWalletValidation),
    fiatWalletController.getExchangeFiatWallet
  );

router
  .route('/fiat/:id')
  .get(
    auth(allPermissions.Wallets.Get),
    validate(fiatWalletValidation.getFiatWalletByIdValidation),
    fiatWalletController.getFiatWalletById
  )
  .patch(
    auth(allPermissions.Wallets.Create),
    validate(fiatWalletValidation.updateFiatWalletByIdValidation),
    fiatWalletController.updateFiatWalletById
  )
  .put(
    auth(allPermissions.Wallets.Create),
    validate(fiatWalletValidation.activateCurrencyWalletByIdValidation),
    fiatWalletController.activateCurrencyWalletById
  )
  .delete(
    auth(allPermissions.Wallets.Manage),
    validate(fiatWalletValidation.deleteCurrencyWalletByIdValidation),
    fiatWalletController.deleteCurrencyWalletById
  );

router
  .route('/fiat/:id/deactivate')
  .put(
    auth(allPermissions.Wallets.Create),
    validate(fiatWalletValidation.deactivateFiatWallet),
    fiatWalletController.deactivateCurrencyWalletById
  )
  .put(
    auth(allPermissions.Wallets.Create),
    validate(fiatWalletValidation.deactivateUserFiatWalletValidation),
    fiatWalletController.deactivateUserFiatWallet
  );

export default router;
