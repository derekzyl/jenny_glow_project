import { BVNDetails } from '@modules/flutterwave/interfaces/interface.payoutsubaccount';

export type WebhookEvent = {
  event: string; // charge.completed

  data: BVNDetails | IncomingDepositI | IncomingTransferI;
};

export interface IncomingDepositI {
  id: number;
  tx_ref: string;
  flw_ref: string;
  device_fingerprint: string;
  amount: number;
  currency: string;
  charged_amount: number;
  app_fee: number;
  merchant_fee: number;
  processor_response: string;
  auth_model: string;
  ip: string;
  narration: string;
  status: string;
  payment_type: string;
  created_at: string;
  account_id: number;
  customer: {
    id: number;
    name: string;
    phone_number: string;
    email: string;
    created_at: string;
  };
}
export interface IncomingTransferI {
  id: number;
  account_number: string;
  bank_name: string;
  bank_code: string;
  fullname: string;
  created_at: string;
  currency: string;
  debit_currency: string;
  amount: number;
  fee: number;
  status: string;
  reference: string;
  meta: {
    Sender: string;
    FirstName: string;
    LastName: string;
    BeneficiaryCountry: string;
    MobileNumber: string;
    EmailAddress: string;
    MerchantName: string;
  }[];
  narration: string;
  approver: null;
  complete_message: string;
  requires_approval: number;
  is_approved: number;
}

// const cincoming = {
//   event: 'charge.completed',
//   data: {
//     id: 1312406045,
//     tx_ref: 'PSA-y04qd5as2dhcjrpo',
//     flw_ref: '100004240321173920112737404697',
//     device_fingerprint: 'N/A',
//     amount: 100,
//     currency: 'NGN',
//     charged_amount: 100,
//     app_fee: 1.4,
//     merchant_fee: 0,
//     processor_response: 'success',
//     auth_model: 'AUTH',
//     ip: '::ffff:172.16.91.238',
//     narration: 'account opening for gbenga kings',
//     status: 'successful',
//     payment_type: 'bank_transfer',
//     created_at: '2024-03-21T17:40:08.000Z',
//     account_id: 835106,
//     customer: {
//       id: 823510840,
//       name: 'gbenga kings',
//       phone_number: '09023782342',
//       email: 'haddox.kiko@dealoaks.com',
//       created_at: '2024-03-21T17:29:07.000Z',
//     },
//   },
//   headers: {
//     host: 'paypad.onrender.com',
//     'content-length': '673',
//     accept: 'application/json',
//     'accept-encoding': 'gzip',
//     'cdn-loop': 'cloudflare; subreqs=1',
//     'cf-connecting-ip': '54.76.248.30',
//     'cf-ew-via': '15',
//     'cf-ipcountry': 'IE',
//     'cf-ray': '867fb9c0763d955b-DUB',
//     'cf-visitor': '{"scheme":"https"}',
//     'cf-worker': 'onrender.com',
//     'content-type': 'application/json',
//     'render-proxy-ttl': '4',
//     'rndr-id': 'c1876959-cb80-4236',
//     traceparent: '00-65fc70f800000000470bfa91bb7fa95d-73598abe50041764-01',
//     tracestate: 'dd=t.tid:65fc70f800000000;t.dm:-1;s:1;p:73598abe50041764',
//     'true-client-ip': '54.76.248.30',
//     'verif-hash': 'theNewGoldenOppotunityIsCome',
//     'x-datadog-parent-id': '8311827137279825764',
//     'x-datadog-sampling-priority': '1',
//     'x-datadog-tags': '_dd.p.tid=65fc70f800000000,_dd.p.dm=-1',
//     'x-datadog-trace-id': '5119460905259608413',
//     'x-forwarded-for': '54.76.248.30, 172.71.150.80, 10.220.46.193',
//     'x-forwarded-proto': 'https',
//     'x-request-start': '1711042811072499',
//   },
// };

// const y-confirm-trans = {
//   status: 'success',
//   message: 'Transaction fetched successfully',
//   data: {
//     id: 1312406045,
//     tx_ref: 'PSA-y04qd5as2dhcjrpo',
//     flw_ref: '100004240321173920112737404697',
//     device_fingerprint: 'N/A',
//     amount: 100,
//     currency: 'NGN',
//     charged_amount: 100,
//     app_fee: 1.4,
//     merchant_fee: 0,
//     processor_response: 'success',
//     auth_model: 'AUTH',
//     ip: '::ffff:172.16.91.238',
//     narration: 'account opening for  gbenga kings ',
//     status: 'successful',
//     payment_type: 'bank_transfer',
//     created_at: '2024-03-21T17:40:08.000Z',
//     account_id: 835106,
//     meta: {
//       originatorname: 'DEREK - OGAGARUE',
//       bankname: 'OPAY DIGITAL SERVICES LIMITED',
//       originatoramount: 'N/A',
//       originatoraccountnumber: '070*******22',
//     },
//     amount_settled: 98.6,
//     customer: {
//       id: 823510840,
//       name: 'gbenga kings',
//       phone_number: '09023782342',
//       email: 'haddox.kiko@dealoaks.com',
//       created_at: '2024-03-21T17:29:07.000Z',
//     },
//   },
// };

// const z-transfer = {
//   status: 'success',
//   message: 'Transfer Queued Successfully',
//   data: {
//     id: 71780293,
//     account_number: '3039173235',
//     bank_code: '011',
//     full_name: 'OGAGARUE DEREK',
//     created_at: '2024-03-21T19:46:34.000Z',
//     currency: 'NGN',
//     debit_currency: 'NGN',
//     amount: 100,
//     fee: 10.75,
//     status: 'NEW',
//     reference: 'TRANS-nvsuiysb3mrgg7',
//     meta: [
//       {
//         Sender: 'dave mike',
//         FirstName: 'OGAGARUE',
//         LastName: 'DEREK',
//         BeneficiaryCountry: 'NG',
//         MobileNumber: '08165006359',
//         EmailAddress: 'oslo.elet@dealoaks.com',
//         MerchantName: 'Wema Bank PLC',
//       },
//     ],
//     narration: 'transfers',
//     complete_message: '',
//     requires_approval: 0,
//     is_approved: 1,
//     bank_name: 'FIRST BANK PLC',
//   },
// };

// const xx={
//   "event": "transfer.completed",
//   "data": {
//     "id": 71780490,
//     "account_number": "3039173235",
//     "bank_name": "FIRST BANK PLC",
//     "bank_code": "011",
//     "fullname": "OGAGARUE DEREK",
//     "created_at": "2024-03-21T19:50:13.000Z",
//     "currency": "NGN",
//     "debit_currency": "NGN",
//     "amount": 100,
//     "fee": 10.75,
//     "status": "SUCCESSFUL",
//     "reference": "TRANS-nvsuiysb3mruuugg7",
//     "meta": [
//       {
//         "Sender": "dave mike",
//         "FirstName": "OGAGARUE",
//         "LastName": "DEREK",
//         "BeneficiaryCountry": "NG",
//         "MobileNumber": "08165006359",
//         "EmailAddress": "oslo.elet@dealoaks.com",
//         "MerchantName": "Wema Bank PLC"
//       }
//     ],
//     "narration": "transfers",
//     "approver": null,
//     "complete_message": "Transaction was successful",
//     "requires_approval": 0,
//     "is_approved": 1
//   },
//   "headers": {
//     "host": "paypad.onrender.com",
//     "user-agent": "axios/0.19.2",
//     "content-length": "673",
//     "accept": "application/json, text/plain, */*",
//     "accept-encoding": "gzip",
//     "cdn-loop": "cloudflare; subreqs=1",
//     "cf-connecting-ip": "34.254.131.32",
//     "cf-ew-via": "15",
//     "cf-ipcountry": "IE",
//     "cf-ray": "8680789447c079ea-DUB",
//     "cf-visitor": "{\"scheme\":\"https\"}",
//     "cf-worker": "onrender.com",
//     "content-type": "application/json;charset=utf-8",
//     "render-proxy-ttl": "4",
//     "rndr-id": "935a97d8-607f-424d",
//     "traceparent": "00-65fc8f820000000031ad94fa966084d2-2290c01579910b64-01",
//     "tracestate": "dd=t.tid:65fc8f8200000000;t.dm:-1;s:1;p:2290c01579910b64",
//     "true-client-ip": "34.254.131.32",
//     "verif-hash": "theNewGoldenOppotunityIsCome",
//     "x-datadog-parent-id": "2490701792402279268",
//     "x-datadog-sampling-priority": "1",
//     "x-datadog-tags": "_dd.p.tid=65fc8f8200000000,_dd.p.dm=-1",
//     "x-datadog-trace-id": "3579681082815055058",
//     "x-forwarded-for": "34.254.131.32, 172.71.150.221, 10.220.46.192",
//     "x-forwarded-proto": "https",
//     "x-request-start": "1711050627351666"
//   }
// }

// const hhcofirm-transfer =
// {
//     "status": "success",
//     "message": "Transfer fetched",
//     "data": {
//         "id": 71780490,
//         "account_number": "3039173235",
//         "bank_code": "011",
//         "full_name": "OGAGARUE DEREK",
//         "created_at": "2024-03-21T19:50:13.000Z",
//         "currency": "NGN",
//         "debit_currency": "NGN",
//         "amount": 100,
//         "fee": 10.75,
//         "status": "SUCCESSFUL",
//         "reference": "TRANS-nvsuiysb3mruuugg7",
//         "meta": [
//             {
//                 "beneficiary_country": "NG"
//             }
//         ],
//         "narration": "transfers",
//         "approver": null,
//         "complete_message": "Transaction was successful",
//         "requires_approval": 0,
//         "is_approved": 1,
//         "bank_name": "FIRST BANK PLC"
//     }
// }
