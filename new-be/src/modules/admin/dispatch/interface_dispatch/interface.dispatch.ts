import { Document, Model, Types } from 'mongoose';
export enum DeliveryStatusE {
  RECEIVED_BY_CUSTOMER = 'RECEIVED_BY_CUSTOMER',
  DISPATCHED = 'DISPATCHED',
  ON_TRANSIT = 'ON_TRANSIT',
  PENDING = 'PENDING',
  DELIVERED_BY_DISPATCHER = 'DELIVERED_BY_DISPATCHER',
}
export enum DispatchCompany {
  DHL = 'DHL',
  FEDEX = 'FEDEX',
  OTHERS = 'OTHERS',
}
export interface DispatchI {

  orderId: string;
  trackingId: string;

  dispatchedBy: Types.ObjectId;
  dispatchedTo: Types.ObjectId;
  createdBy: Types.ObjectId,
  updatedBy:Types.ObjectId,

  dispatchCompany: {
    dispatchCompanyTrackId?: string;
    dispatchCompanyName: DispatchCompany;
  };
  dispatchedDate: Date;
  receivedDate: Date;
  deliveryStatus: DeliveryStatusE;
  dispatchInfo: [
    {
      dispatchInfo: string;
      dispatchInfoDate: Date;

    }
  ];
  

}



export interface DispatchDocI extends DispatchI, Document { }
export interface DispatchModelI extends Model<DispatchDocI> { }

export type DispatchBodyT = Pick<DispatchI, "deliveryStatus" | "dispatchedDate" | "orderId" |"dispatchedBy"> & {
  dispatchInfo: string
  
};
