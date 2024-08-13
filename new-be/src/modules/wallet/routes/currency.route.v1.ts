import { auth } from '@modules/auth';
import { validate } from '@modules/validate';
import express, { Router } from 'express';
import { walletCurrencyController, walletCurrencyValidation } from '..';
import { allPermissions } from '../../setting/roles';

const router: Router = express.Router();

/*
    Currencies
*/

router
  .route('/')
  .post(
    auth(allPermissions.Currencies.Manage),
    validate(walletCurrencyValidation.addCurrency),
    walletCurrencyController.addCurrency
  )
  .get(
    auth(allPermissions.Currencies.Get),
    validate(walletCurrencyValidation.getAllCurrencies),
    walletCurrencyController.getAllCurrencies
  );

router
  .route('/currency/:currencyId')
  .get(
    auth(allPermissions.Currencies.Get),
    validate(walletCurrencyValidation.getCurrency),
    walletCurrencyController.getCurrency
  )
  .patch(
    auth(allPermissions.Currencies.Manage),
    validate(walletCurrencyValidation.updateCurrency),
    walletCurrencyController.updateCurrency
  )
  .put(
    auth(allPermissions.Currencies.Manage),
    validate(walletCurrencyValidation.deactivateCurrency),
    walletCurrencyController.deactivateCurrency
  )
  .delete(
    auth(allPermissions.Currencies.Manage),
    validate(walletCurrencyValidation.deleteCurrency),
    walletCurrencyController.deleteCurrency
  );

router.route('/tradable-assets').get(
  auth(allPermissions.Currencies.Get), // Adjust permissions as needed
  walletCurrencyController.getAllTradableAssets
);

router.route('/add-crypto-assets').post(
  auth(allPermissions.Currencies.Manage), // Adjust permissions as needed
  validate(walletCurrencyValidation.addAsset),
  walletCurrencyController.addCryptoAssets
);

router.route('/tradable-assets-with-icons').get(
  auth(allPermissions.Currencies.Get), // Adjust permissions as needed
  walletCurrencyController.getAllTradableAssetsWithIcons
);
router
  .route('/tradable-assets/types')
  .get(auth(allPermissions.Currencies.Get), walletCurrencyController.getAllTradableAssetsTypes);

router
  .route('/tradable-assets/:assetType')
  .get(
    auth(allPermissions.Currencies.Get),
    validate(walletCurrencyValidation.getAssetByType),
    walletCurrencyController.getAssetByType
  );
router
  .route('/update-db-tradable-assets')
  .get(auth(allPermissions.Currencies.Manage), walletCurrencyController.updateDbTradeableAssets);

router
  .route('/user-currencies')
  .get(
    auth(allPermissions.Currencies.Get),
    validate(walletCurrencyValidation.getAllCurrencies),
    walletCurrencyController.queryUserCurrencies
  );
export default router;
