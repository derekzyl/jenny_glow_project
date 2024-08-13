import { QueryResult } from '@modules/paginate/paginate';
import { IUserDoc } from '@modules/user/interfaces.user';
import { Document, Model, Types } from 'mongoose';

/* The `interface IVirtualAccount` is defining the structure and types of properties for a virtual
account. It includes properties such as `userId`, `walletId`, `flwRef`, `orderRef`, `accountName`,
`accountNumber`, `bankName`, `createdAt`, `expiryDate`, `bvn`, `note`, `dateOfBirth`, `phoneNumber`,
`nationality`, `enrollmentBank`, and `enrollmentBranch`. These properties define the information
associated with a virtual account. */
interface IVirtualAccount {
  userId: Types.ObjectId; // Assuming userId is a string, replace with the actual type if different
  walletId: Types.ObjectId; // Assuming walletId is a string, replace with the actual type if different
  flwRef: string;
  orderRef: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  createdAt: string; // Assuming createdAt is a string, replace with the actual type if different
  expiryDate: string; // Assuming expiryDate is a string, replace with the actual type if different
  bvn: string;
  note: string;
  dateOfBirth: string; // Assuming dateOfBirth is a string, replace with the actual type if different
  phoneNumber: string;
  nationality: string;
  enrollmentBank: string;
  enrollmentBranch: string;
  middleName: string;
}

export interface IVirtualAccountDoc extends IVirtualAccount, Document {}

export interface IVirtualAccountModel extends Model<IVirtualAccountDoc> {
  isExists(userId: Types.ObjectId, accountNumber: string, excludeWalletId?: Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export interface IVirtualAccountServicePayload {
  user: IUserDoc;
  bvn: string;
  narration: string;
  tx_ref: string;
}
