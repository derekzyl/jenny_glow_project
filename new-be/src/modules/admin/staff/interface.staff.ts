import { QueryResult } from '@modules/paginate/paginate';
import { Document, Model, Types } from 'mongoose';

// Interface representing a Staff document
export interface IStaff {
  userId: Types.ObjectId;
  
  branchId:Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  isActive: boolean;
  dateOfBirth: Date;
  phoneNumber: string;
  address: string;
  hireDate: Date;
  lastActiveTime: Date;
  isAuthenticated: boolean;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  salary?: number;
  benefits?: string;
  notes?: string;
}

export interface IStaffDoc extends IStaff, Document {}
export interface IStaffModel extends Model<IStaffDoc> {
  isEmailTaken(email: string, excludeUserId?: Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateStaffType = Partial<Omit<IStaff, 'userId'>>;
export type CreateStaffType = Omit<IStaff, 'userId'> & {
  password?: string;
  role?: Types.ObjectId;
};
