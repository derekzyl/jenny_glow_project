// import axios from 'axios';

// async function requestCoins() {
//   const requestOptions = {
//     url: '/',
//     method: 'GET',
//     baseURL: `https://wise-butterfly-15.deno.dev`,

//     headers: {
//       'Content-Type': 'application/json',
//     },
//   };

//   try {
//     const { data: response } = await axios(requestOptions);

//     return response;
//   } catch (error) {
//     throw new Error(error);
//   }
// }

// Promise.resolve(requestCoins()).then((response) => {
//   console.log(response.data);
// });

// const data = await requestCoins();
// console.log(data);

// export function removeProp(obj, keys) {
//   const newObj= {};

//   for (const key in obj) {
//     if (!keys.includes(key)) {
//       newObj[key] = obj[key];
//     }
//   }

//   return newObj;
// }

// function handleLineBreaks(body) {
//   // Combine newline and character break logic
//   const regex = new RegExp('(?<!\r)\n|.{1,40}(?!s)', 'g');

//   // Replace with <br> tags while preserving whole words
//   return body.replace(regex, '$&<br>');
// }

// const bodyWithLineBreaks = handleLineBreaks(
//   'this is a given \n test for creating solutions to possble \n and to simultaenously give you the best on this planet earth so help me God'
// );
// console.log(bodyWithLineBreaks);
const permissions = [
  {
    name: 'superAdmin',
    details: 'can control everything',
  },
  {
    name: 'createRoles',
    details: 'can be able to create roles',
  },
  {
    name: 'getAllRoles',
    details: 'can be able to get all roles',
  },
  {
    name: 'getRoles',
    details: 'can be able to get roles',
  },
  {
    name: 'updateRoles',
    details: 'can be able to update roles',
  },
  {
    name: 'deleteRoles',
    details: 'can be able to delete roles',
  },
  {
    name: 'getKyc',
    details: 'can be able to get KYC',
  },
  {
    name: 'manageCurrencies',
    details: 'can be able to manage currencies',
  },
  {
    name: 'verifyKyc',
    details: 'can be able to verify KYC',
  },
  {
    name: 'getCurrencies',
    details: 'can be able to get currencies',
  },
  {
    name: 'getCurrencyPairs',
    details: 'can be able to get currency pairs',
  },
  {
    name: 'createCurrencyPairs',
    details: 'can be able to create currency pairs',
  },
  {
    name: 'updateCurrencyPairs',
    details: 'can be able to update currency pairs',
  },
  {
    name: 'deactivateCurrencyPairs',
    details: 'can be able to deactivate currency pairs',
  },
  {
    name: 'deleteCurrencyPairs',
    details: 'can be able to delete currency pairs',
  },
  {
    name: 'getCurrencyPairsRate',
    details: 'can be able to get currency pairs rate',
  },
  {
    name: 'createCurrencyPairsRate',
    details: 'can be able to create currency pairs rate',
  },
  {
    name: 'updateCurrencyPairsRate',
    details: 'can be able to update currency pairs rate',
  },
  {
    name: 'deactivateCurrencyPairsRate',
    details: 'can be able to deactivate currency pairs rate',
  },
  {
    name: 'deleteCurrencyPairsRate',
    details: 'can be able to delete currency pairs rate',
  },
  {
    name: 'getAllCurrencyPairsRates',
    details: 'can be able to get all currency pairs rates',
  },
  {
    name: 'getGiftCardsRate',
    details: 'can be able to get gift cards rate',
  },
  {
    name: 'createGiftCardsRate',
    details: 'can be able to create gift cards rate',
  },
  {
    name: 'updateGiftCardsRate',
    details: 'can be able to update gift cards rate',
  },
  {
    name: 'deleteGiftCardsRate',
    details: 'can be able to delete gift cards rate',
  },
  {
    name: 'deactivateGiftCardsRate',
    details: 'can be able to deactivate gift cards rate',
  },
  {
    name: 'getAllGiftCardsRates',
    details: 'can be able to get all gift cards rates',
  },
  {
    name: 'ApproveGiftCard',
    details: 'can be able to approve gift card',
  },
  {
    name: 'transactGiftCard',
    details: 'can be able to transact gift card',
  },
  {
    name: 'getCustomerService',
    details: 'can be able to get customer service',
  },
  {
    name: 'manageCustomerService',
    details: 'can be able to manage customer service',
  },
  {
    name: 'getTransactions',
    details: 'can be able to get transactions',
  },
  {
    name: 'manageTransactions',
    details: 'can be able to manage transactions',
  },
  {
    name: 'getExchanges',
    details: 'can be able to get exchanges',
  },
  {
    name: 'createExchange',
    details: 'can be able to create exchange',
  },
  {
    name: 'getAllExchanges',
    details: 'can be able to get all exchanges',
  },
  {
    name: 'ExchangesTransactionOperations',
    details: 'for buy and sell permissions which the staff should not have',
  },
  {
    name: 'deleteExchanges',
    details: 'can be able to delete exchanges',
  },
  {
    name: 'updateExchanges',
    details: 'can be able to update exchanges',
  },
  {
    name: 'deactivateExchange',
    details: 'can be able to deactivate exchange',
  },
  {
    name: 'getBills',
    details: 'can be able to get bills',
  },
  {
    name: 'getAllBills',
    details: 'for staffs/admins',
  },
  {
    name: 'createBills',
    details: 'for users, so they can get data specific to them',
  },
  {
    name: 'getUsers',
    details: 'can be able to get users',
  },
  {
    name: 'manageUsers',
    details: 'can be able to manage users',
  },
  {
    name: 'userOnly',
    details: 'for user only roles',
  },
  {
    name: 'verifyKyc',
    details: 'can be able to verify KYC',
  },
  {
    name: 'getWallets',
    details: 'can be able to get wallets',
  },
  {
    name: 'createWallets',
    details: 'can be able to create wallets',
  },
  {
    name: 'manageWallets',
    details: 'can be able to manage wallets',
  },
  {
    name: 'getVirtualAccounts',
    details: 'can be able to get virtual accounts',
  },
  {
    name: 'createVirtualAccounts',
    details: 'can be able to create virtual accounts',
  },
  {
    name: 'getAllVirtualAccounts',
    details: 'can be able to get all virtual accounts',
  },
  {
    name: 'deleteVirtualAccounts',
    details: 'can be able to delete virtual accounts',
  },
  {
    name: 'updateVirtualAccounts',
    details: 'can be able to update virtual accounts',
  },
  {
    name: 'getStaffs',
    details: 'can be able to get staffs',
  },
  {
    name: 'createStaffs',
    details: 'can be able to create staffs',
  },
  {
    name: 'getAllStaffs',
    details: 'can be able to get all staffs',
  },
  {
    name: 'deleteStaffs',
    details: 'can be able to delete staffs',
  },
  {
    name: 'updateStaffs',
    details: 'can be able to update staffs',
  },
  {
    name: 'updateSystems',
    details: 'can be able to update systems',
  },
  {
    name: 'createSystems',
    details: 'can be able to create systems',
  },
  {
    name: 'deleteSystems',
    details: 'can be able to delete systems',
  },
  {
    name: 'updateStatistics',
    details: 'can be able to update statistics',
  },
  {
    name: 'createStatistics',
    details: 'can be able to create statistics',
  },
  {
    name: 'deleteStatistics',
    details: 'can be able to delete statistics',
  },
];

const allPermissions = {
  SuperAdmin: 'superAdmin',
  Roles: {
    Create: 'createRoles',
    GetAll: 'getAllRoles',
    Get: 'getRoles',
    Update: 'updateRoles',
    Delete: 'deleteRoles',
  },
  Kyc: {
    Get: 'getKyc',
    Manage: 'manageCurrencies',
    Verify: 'verifyKyc',
  },
  Currencies: {
    Get: 'getCurrencies',
    Manage: 'manageCurrencies',
  },
  CurrencyPairs: {
    Get: 'getCurrencyPairs',
    Create: 'createCurrencyPairs',
    Update: 'updateCurrencyPairs',
    Deactivate: 'deactivateCurrencyPairs',
    Delete: 'deleteCurrencyPairs',
  },
  CurrencyPairsRates: {
    GetRate: 'getCurrencyPairsRate',
    CreateRate: 'createCurrencyPairsRate',
    UpdateRate: 'updateCurrencyPairsRate',
    DeactivateRate: 'deactivateCurrencyPairsRate',
    DeleteRate: 'deleteCurrencyPairsRate',
    GetAllRates: 'getAllCurrencyPairsRates',
  },
  GiftCards: {
    GetRate: 'getGiftCardsRate',
    CreateRate: 'createGiftCardsRate',
    UpdateRate: 'updateGiftCardsRate',
    DeleteRate: 'deleteGiftCardsRate',
    DeactivateRate: 'deactivateGiftCardsRate',
    GetAllRates: 'getAllGiftCardsRates',
    ApproveGiftCard: 'ApproveGiftCard',
    transactGiftCard: 'transactGiftCard',
  },
  CustomerService: {
    Get: 'getCustomerService',
    Manage: 'manageCustomerService',
  },

  Transactions: {
    Get: 'getTransactions',
    Manage: 'manageTransactions',
  },
  Exchanges: {
    Get: 'getExchanges',
    Create: 'createExchange',
    GetAll: 'getAllExchanges',
    TransactionOps: 'ExchangesTransactionOperations', // for buy and sell permissions which the staff should not have
    Delete: 'deleteExchanges',
    Update: 'updateExchanges',
    Deactivate: 'deactivateExchange',
  },
  Bills: {
    Get: 'getBills',
    GetAll: 'getAllBills', // for staffs/admins
    Create: 'createBills', // for users, so they can get data specific to them
  },
  Users: {
    Get: 'getUsers',
    Manage: 'manageUsers',
    UserOnly: 'userOnly', // for user only roles
    VerifyKyc: 'verifyKyc',
  },
  Wallets: {
    Get: 'getWallets',
    Create: 'createWallets',
    Manage: 'manageWallets',
  },
  VirtualAccounts: {
    Get: 'getVirtualAccounts',
    Create: 'createVirtualAccounts',
    GetAll: 'getAllVirtualAccounts',
    Delete: 'deleteVirtualAccounts',
    Update: 'updateVirtualAccounts',
  },
  Staffs: {
    Get: 'getStaffs',
    Create: 'createStaffs',
    GetAll: 'getAllStaffs',
    Delete: 'deleteStaffs',
    Update: 'updateStaffs',
  },
  Systems: {
    Update: 'updateSystems',
    Create: 'createSystems',
    Delete: 'deleteSystems',
  },
  Statistics: {
    Update: 'updateStatistics',
    Create: 'createStatistics',
    Delete: 'deleteStatistics',
  },
};

const x = new Set(permissions.map((d) => d.name).flat());
const y = new Set(Object.values(allPermissions).flatMap((data) => (typeof data !== 'string' ? Object.values(data) : data)));
const xx = Array.from(x);
const yy = Array.from(y);
console.log(x.length, 'x-------------------->>');
console.log(y.length, '---------------------->>>');

// const no = [];
// y.forEach((d) => {
//   if (!x.includes(d)) {
//     no.push(d);
//   }
// });
// consoles.log(no, 'noooooooooooooo');
