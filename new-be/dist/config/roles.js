/*
    Roles and Permissions
*/
// All Permissions
export const allPermissions = {
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
        TransactionOps: 'ExchangesTransactionOperations',
        Delete: 'deleteExchanges',
        Update: 'updateExchanges',
        Deactivate: 'deactivateExchange',
    },
    Bills: {
        Get: 'getBills',
        GetAll: 'getAllBills',
        Create: 'createBills', // for users, so they can get data specific to them
    },
    Users: {
        Get: 'getUsers',
        Manage: 'manageUsers',
        UserOnly: 'userOnly',
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
};
// All Roles
export const allRoles = {
    // Customer
    user: [
        allPermissions.Users.UserOnly,
        allPermissions.Transactions.Get,
        allPermissions.Currencies.Get,
        allPermissions.CurrencyPairs.Get,
        allPermissions.CurrencyPairsRates.GetAllRates,
        allPermissions.CurrencyPairsRates.GetRate,
        allPermissions.GiftCards.GetRate,
        allPermissions.Exchanges.TransactionOps,
        allPermissions.Bills.Create,
        allPermissions.Wallets.Get,
        allPermissions.Wallets.Create,
        allPermissions.VirtualAccounts.Get,
        allPermissions.VirtualAccounts.Create,
        allPermissions.GiftCards.GetRate,
    ],
    // Staff
    // accountant: [allPermissions.Users.Get],
    // trader: [allPermissions.Exchanges.Get, allPermissions.Exchanges.Manage],
    // reconciller: [allPermissions.Users.Get, allPermissions.Exchanges.Get, allPermissions.Exchanges.Manage],
    // // Admin
    // admin: Object.values(allPermissions)
    //   .flatMap<string>((role) => Object.values(role))
    //   .filter((role) => role !== 'userOnly'), // Object.values(allPermissions).flatMap<string>(Object.values),
};
// All Kyc Tier Permissions
export const allKycTierFields = {
    PhoneNumber: 'phoneNumber',
    Address: 'address',
    Country: 'country',
    DateOfBirth: 'dateOfBirth',
    DocumentNumber: 'documentNumber',
    DocumentImage: 'documentImage',
    UserPhoto: 'userPhoto',
    BVN: 'BVN',
    NIN: 'NIN',
};
export const allKycTierPermissions = {
    0: [],
    1: [allKycTierFields.PhoneNumber, allKycTierFields.Country, allKycTierFields.DateOfBirth, allKycTierFields.BVN],
    2: [allKycTierFields.DocumentNumber, allKycTierFields.DocumentImage, allKycTierFields.UserPhoto],
    3: [allKycTierFields.Address],
};
export const kycTiers = Object.keys(allKycTierPermissions).map(Number);
export const kycTierPermissions = new Map(Object.entries(allKycTierPermissions).map(([key, value]) => [Number(key), value]));
// Define possible states as an enum
export var KycFieldStates;
(function (KycFieldStates) {
    KycFieldStates["UNINITIATED"] = "UNINITIATED";
    KycFieldStates["PENDING"] = "PENDING";
    KycFieldStates["FAILED"] = "FAILED";
    KycFieldStates["VERIFIED"] = "VERIFIED";
})(KycFieldStates || (KycFieldStates = {}));
// export const roles: string[] = Object.keys(/* await getRoles()) || */ allRoles);
// export const rolePermissions: Map<string, string[]> = new Map(Object.entries(allRoles));
// function getRoles(): Promise<Record<string, string[]>> {
//   return new Promise((resolve, reject) => {
//     ROLES.find()
//       .then((roles) => {
//         if (!roles) {
//           reject(new Error('No roles found'));
//           return;
//         }
//         const mapRoles: Record<string, string[]> = {};
//         roles.map((role) => {
//           mapRoles[role.name] = role.permissions;
//         });
//         resolve(mapRoles);
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// }
async function getRoles() {
    // try {
    //   const roles = await ROLES.find();
    //   if (!roles) {
    //     throw new Error('No roles found');
    //   }
    //   const mapRoles: Record<string, string[]> = {};
    //   roles.forEach((role) => {
    //     mapRoles[role.name] = role.permissions;
    //   });
    //   return mapRoles;
    // } catch (error) {
    //   throw error;
    // }
    return { admin: ['roles'] };
}
// (async () => {
//   const allRolesMap = await getRoles();
//   roles = Object.keys(allRolesMap);
//   rolePermissions = new Map(Object.entries(allRolesMap));
// })();
// export { rolePermissions, roles };
export let rolePermissions;
export let roles;
(async () => {
    try {
        const allRolesMap = await getRoles();
        // Assign values to rolePermissions
        rolePermissions = new Map(Object.entries(allRolesMap));
        roles = Object.keys(allRolesMap);
    }
    catch (error) {
        console.error('Error fetching roles:', error);
    }
})();
//# sourceMappingURL=roles.js.map