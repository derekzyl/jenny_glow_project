/* eslint-disable import/no-mutable-exports */
/*
    Role and Permissions
*/


// All Permissions
export const allPermissions = {
  SuperAdmin: 'superAdmin',
  Admin: 'admin',
  Branch: {
    Create: 'createBranch',
    GetAll: 'getAllBranch',
    Get: 'getBranch',
    Update: 'updateBranch',
  },
  Role: {
    Create: 'createRole',
    GetAll: 'getAllRole',
    Get: 'getRole',
    Update: 'updateRole',
    Delete: 'deleteRole',
  },
  User: {
    Create: 'createUser',
    GetAll: 'getAllUser',
    Get: 'getUser',
    Update: 'updateUser',
    Delete: 'deleteUser',
    Manage: 'manageUser',
  },
  Product: {
    Create: 'createProduct',
    GetAll: 'getAllProduct',
    Get: 'getProduct',
    Update: 'updateProduct',
    Delete: 'deleteProduct',
    Manage: 'manageProduct',
  },
  Category: {
    Create: 'createCategory',
    GetAll: 'getAllCategory',
    Get: 'getCategory',
    Update: 'updateCategory',
    Delete: 'deleteCategory',
    Manage: 'manageCategory',
  },
  Order: {
    Create: 'createOrder',
    GetAll: 'getAllOrder',
    Get: 'getOrder',
    Update: 'updateOrder',
    Delete: 'deleteOrder',
    Manage: 'manageOrder',
    GetBranchOrder: 'getBranchOrder',
    GetAllBranchOrder: 'getAllBranchOrder',
    UpdateBranchOrder: 'updateBranchOrder',
    DeleteBranchOrder: 'deleteBranchOrder',
  },
  Payment: {
    Create: 'createPayment',
    GetAll: 'getAllPayment',
    GetBranchPayment: 'getBranchPayment',
    
    Get: 'getPayment',
    Update: 'updatePayment',
    Delete: 'deletePayment',
    Manage: 'managePayment',
    GetAllBranchPayment: 'getAllBranchPayment',
    UpdateBranchPayment: 'updateBranchPayment',
    DeleteBranchPayment: 'deleteBranchPayment',

  },
  Discount: {
    Create: 'createDiscount',
    GetAll: 'getAllDiscount',
    Get: 'getDiscount',
    Update: 'updateDiscount',
    Delete: 'deleteDiscount',
    Manage: 'manageDiscount',
    GetAllBranchDiscount: 'getAllBranchDiscount',
    UpdateBranchDiscount: 'updateBranchDiscount',
    DeleteBranchDiscount: 'deleteBranchDiscount',

  },
  Review: {
    Create: 'createReview',
    GetAll: 'getAllReview',
    Get: 'getReview',
    Update: 'updateReview',
    Delete: 'deleteReview',
    Manage: 'manageReview',
  },
  Shipping: {
    Create: 'createShipping',
    GetAll: 'getAllShipping',
    Get: 'getShipping',
    Update: 'updateShipping',
    Delete: 'deleteShipping',
    Manage: 'manageShipping',
  },
  CustomerService: {
    Create: 'createCustomerService',
    GetAll: 'getAllCustomerService',
    Get: 'getCustomerService',
    Update: 'updateCustomerService',
    Delete: 'deleteCustomerService',
    Manage: 'manageCustomerService',
  },
  Analytic: {
    View: 'viewAnalytic',
    Manage: 'manageAnalytic',
  },
  Notification: {
    Create: 'createNotification',
    GetAll: 'getAllNotification',
    Get: 'getNotification',
    Update: 'updateNotification',
    Delete: 'deleteNotification',
    Manage: 'manageNotification',
  },
  Inventory: {
    Create: 'createInventory',
    GetAll: 'getAllInventory',
    Get: 'getInventory',
    Update: 'updateInventory',
    Delete: 'deleteInventory',
    Manage: 'manageInventory',
    Approve: 'approveInventory',
    CreateBranchInventory: 'createBranchInventory',
    GetAllBranchInventory: 'getAllBranchInventory',
    GetBranchInventory: 'getBranchInventory',
    UpdateBranchInventory: 'updateBranchInventory',
    DeleteBranchInventory: 'deleteBranchInventory',
  },
  Staff: {
    Create: 'createStaff',
    GetAll: 'getAllStaff',
    Get: 'getStaff',
    Update: 'updateStaff',
    Delete: 'deleteStaff',
    Manage: 'manageStaff',
    CreateBranchStaff: 'createBranchStaff',
    GetAllBranchStaff: 'getAllBranchStaff',
    GetBranchStaff: 'getBranchStaff',
    UpdateBranchStaff: 'updateBranchStaff',
  },
  Setting: {
    Update: 'updateSetting',
    Manage: 'manageSetting',
  },
  Report: {
    Create: 'createReport',
    GetAll: 'getAllReport',
    Get: 'getReport',
    Update: 'updateReport',
    Delete: 'deleteReport',
    Manage: 'manageReport',
    createBranchReport: 'createBranchReport',
    getAllBranchReport: 'getAllBranchReport',
    getBranchReport: 'getBranchReport',
    updateBranchReport: 'updateBranchReport',
    deleteBranchReport: 'deleteBranchReport',

  },
  Refund: {
    Create: 'createRefund',
    GetAll: 'getAllRefund',
    Get: 'getRefund',
    Update: 'updateRefund',
    Delete: 'deleteRefund',
    Manage: 'manageRefund',
    CreateBranchRefund: 'createBranchRefund',
    GetAllBranchRefund: 'getAllBranchRefund',
    GetBranchRefund: 'getBranchRefund',
    UpdateBranchRefund: 'updateBranchRefund',
    DeleteBranchRefund: 'deleteBranchRefund',
  },
  LoyaltyProgram: {
    Create: 'createLoyaltyProgram',
    GetAll: 'getAllLoyaltyProgram',
    Get: 'getLoyaltyProgram',
    Update: 'updateLoyaltyProgram',
    Delete: 'deleteLoyaltyProgram',
    Manage: 'manageLoyaltyProgram',
  },
  Advertisement: {
    Create: 'createAdvertisement',
    GetAll: 'getAllAdvertisement',
    Get: 'getAdvertisement',
    Update: 'updateAdvertisement',
    Delete: 'deleteAdvertisement',
    Manage: 'manageAdvertisement',

  },
  Coupon: {
    Create: 'createCoupon',
    GetAll: 'getAllCoupon',
    Get: 'getCoupon',
    Update: 'updateCoupon',
    Delete: 'deleteCoupon',
    Manage: 'manageCoupon',
  },
  AuditLog: {
    View: 'viewAuditLog',
    Manage: 'manageAuditLog',
    ViewBranchAuditLog: 'viewBranchAuditLog',
    ManageBranchAuditLog: 'manageBranchAuditLog',
  },
  Subscription: {
    Create: 'createSubscription',
    GetAll: 'getAllSubscription',
    Get: 'getSubscription',
    Update: 'updateSubscription',
    Delete: 'deleteSubscription',
    Manage: 'manageSubscription',
  },
  Campaign: {
    Create: 'createCampaign',
    GetAll: 'getAllCampaign',
    Get: 'getCampaign',
    Update: 'updateCampaign',
    Delete: 'deleteCampaign',
    Manage: 'manageCampaign',
  
  }, 
  Transaction: {
    Manage: 'manageTransaction',
    Get: 'getTransaction',
  },
  Stock: {
    Create: 'createStock',
    GetAll: 'getAllStock',
    Get: 'getStock',
    Update: 'updateStock',
    Delete: 'deleteStock', Manage: 'manageStock',
    Transfer: 'transferStock',

  },
  
};
export const allRole = {
  // Customer
  customer: [
    allPermissions.User.Create,
    allPermissions.Order.Create,
    allPermissions.Order.Get,
    allPermissions.Product.Get,
    allPermissions.Review.Create,
    allPermissions.Review.Get,
    allPermissions.Review.Update,
    allPermissions.Review.Delete,
    allPermissions.Discount.Get,
    allPermissions.Notification.Get,
  ],

  // Staff
  accountant: [
    allPermissions.Payment.GetAll,
    allPermissions.Payment.Manage,
    allPermissions.Order.GetAll,
    allPermissions.Order.Update,
    allPermissions.Refund.GetAll,
    allPermissions.Refund.Manage,
  ],
  customerServiceRep: [
    allPermissions.CustomerService.Create,
    allPermissions.CustomerService.GetAll,
    allPermissions.CustomerService.Get,
    allPermissions.CustomerService.Update,
    allPermissions.CustomerService.Delete,
    allPermissions.Notification.Get,
    allPermissions.Notification.Manage,
  ],
  inventoryManager: [
    allPermissions.Inventory.Create,
    allPermissions.Inventory.GetAll,
    allPermissions.Inventory.Get,
    allPermissions.Inventory.Update,
    allPermissions.Inventory.Delete,
    allPermissions.Product.Create,
    allPermissions.Product.GetAll,
    allPermissions.Product.Get,
    allPermissions.Product.Update,
    allPermissions.Product.Delete,
  ],
  salesRep: [
    allPermissions.Order.Create,
    allPermissions.Order.GetAll,
    allPermissions.Order.Get,
    allPermissions.Order.Update,
    allPermissions.Order.Delete,
    
    allPermissions.Discount.GetAll,
    allPermissions.Discount.Get,
    allPermissions.Notification.Get,
    allPermissions.Notification.Create,
  ],

  // Admin
  admin: Object.values(allPermissions)
    .flatMap((role) => Object.values(role))
    .filter((role) => role !== 'usersOnly'),

  // Super Admin
  superAdmin: [allPermissions.SuperAdmin, ...Object.values(allPermissions).flatMap((role) => Object.values(role))],
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
