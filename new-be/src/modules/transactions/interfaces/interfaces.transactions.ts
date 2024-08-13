import { QueryResult } from '@modules/paginate/paginate';
import { GeneralStatus } from '@modules/utils/utils';
import mongoose, { Document, Model } from 'mongoose';

export enum TrxTypes {
  ONLINE_ORDER = 'ONLINE_ORDER',
  POS_ORDER = 'POS_ORDER',
  WALLET = 'WALLET',
  STOCK_TRANSFER = 'STOCK_TRANSFER',
  BRANCH = 'BRANCH',
  INVENTORY = 'INVENTORY',
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY',
  SUB_CATEGORY = 'SUB_CATEGORY',
  CUSTOMER = 'CUSTOMER',
  SUPPLIER = 'SUPPLIER',
  USER = 'USER',
  ROLE = 'ROLE',
  PERMISSION = 'PERMISSION',
  REFUND = 'REFUND',
  RETURN = 'RETURN',
  DISCOUNT = 'DISCOUNT',
  TAX = 'TAX',
  SHIPPING = 'SHIPPING',
  PAYMENT = 'PAYMENT',
  STOCK_ADJUSTMENT = 'STOCK_ADJUSTMENT',
}

export enum TrxCrudTypes {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',

}


export interface ITransaction {
  trxType: TrxTypes;
  referenceId: string; // order id, stock transfer id, wallet id, etc
  createdBy: mongoose.Types.ObjectId;
  details: string;
  trxCrudType: TrxCrudTypes;
  trxRef: string; // transaction reference number
  amount: number;
  status: GeneralStatus;
  paymentMethod?: string; // e.g., 'credit_card', 'paypal', 'bank_transfer'
  currency?: string; // e.g., 'USD', 'EUR'
  taxAmount?: number; // Applicable tax amount
  discountAmount?: number; // Discount applied to the transaction
  shippingCost?: number; // Shipping cost for orders
  items?: Array<any>; // For transactions involving products
  customerId?: mongoose.Types.ObjectId; // Customer associated with the transaction
  supplierId?: mongoose.Types.ObjectId; // Supplier associated with the transaction
  branchId?: mongoose.Types.ObjectId; // Branch associated with the transaction

  notes?: string; // Additional notes or comments about the transaction
  info1?: string;
  info2?: string;
  info3?: string;
  info4?: string;
}

export interface ITransactionDocument extends ITransaction, Document {}
export interface ITransactionModel extends Model<ITransactionDocument> {
  isExists(referenceId: string, excludeTxId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export interface NewCreatedTransaction {
  trxType: TrxTypes;
  referenceId: string;
  createdBy: mongoose.Types.ObjectId;
  trxCrudType: TrxCrudTypes;
trxRef: string;
  details: string;
  amount: number;
  status: GeneralStatus;
  paymentMethod?: string;
  currency?: string;
  taxAmount?: number;
  discountAmount?: number;
  shippingCost?: number;
  items?: Array<any>;
  customerId?: mongoose.Types.ObjectId;
  supplierId?: mongoose.Types.ObjectId;
  branchId?: mongoose.Types.ObjectId;
  notes?: string;
  info1?: {
    key: string;
    value: any;
  };
  info2?: {
    key: string;
    value: any;
  };
  info3?: {
    key: string;
    value: any;
  };
  info4?: {
    key: string;
    value: any;
  };
}