import CRYPTO_HD_WALLETS from './models/model.crypto.wallet';
import FIAT_WALLETS from './models/model.fiat.wallet';
//
import * as cryptoWalletController from './controllers/controller.crypto.wallet';
import * as walletCurrencyController from './controllers/controller.currency.wallet';
import * as fiatWalletController from './controllers/controller.fiat.wallet';
//
import * as cryptoWalletService from './services/service.crypto.wallet';
import * as walletCurrencyService from './services/service.currency.wallet';
import * as fiatWalletService from './services/service.fiat.wallet';
//
import * as giftCardMerchantController from './controllers/controller.giftcard.merchant';
import * as giftCardMerchantService from './services/services.giftcard.merchant';
import * as giftCardMerchantValidation from './validations/validation.giftcard merchant';

import * as cryptoWalletValidation from './validations/validation.crypto.wallet';
import * as walletCurrencyValidation from './validations/validation.currency.wallet';
import * as fiatWalletValidation from './validations/validation.fiat.wallet';

import * as giftCardController from './controllers/controller.giftcard.wallet';
import * as giftCardService from './services/service.giftcard.wallet';
import * as giftCardValidation from './validations/validation.giftcard.wallet';

export {
  CRYPTO_HD_WALLETS,
  FIAT_WALLETS,
  cryptoWalletController,
  cryptoWalletService,
  cryptoWalletValidation,
  fiatWalletController,
  fiatWalletService,
  fiatWalletValidation,
  giftCardController,
  giftCardMerchantController,
  giftCardMerchantService,
  giftCardMerchantValidation,
  giftCardService,
  giftCardValidation,
  // controllers
  walletCurrencyController,
  // services
  walletCurrencyService,
  // validations
  walletCurrencyValidation,
};

// import CRYPTO_WALLET_CONTRACT from './models/model.crypto-contract.wallet';
// import * as walletGiftcardController from './controllers/controller.giftcard.wallet';
// import * as walletGiftcardValidation from './validations/validation.giftcard.wallet';
