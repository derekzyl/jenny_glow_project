//
export const allBillTypes = {
  airtime: 'AIRTIME',
};

export const allBillStatus = {
  success: 'SUCCESSFUL',
  failed: 'FAILED',
  pending: 'PENDING',
};

export const billTypes: string[] = Object.values(allBillTypes);
export const billStatus: string[] = Object.keys(allBillStatus);
