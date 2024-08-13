/* eslint-disable import/prefer-default-export */
import { BVNDetails } from '@modules/flutterwave/interfaces/interface.payoutsubaccount';
import { logger } from '@modules/logger';
import { notificationService } from '@modules/notification';
import { IncomingDepositI, IncomingTransferI, WebhookEvent } from './interfaces/transfer.webhook';
import { bvnWebHook } from './services/service.bvn.webhook';
import { depositWebHook, transferWebHook } from './services/service.transfers.webhook';
import { transactionnHash } from './services/service.verify-hash';

export const webhookService = async (req: WebhookEvent, transHash: string) => {
  logger.info(`webhook event received ${req.event} transHash: ${transHash}`);
  const d = transactionnHash(transHash);
  if (!d) {
    await notificationService.sendNotificationToStaffs({
      body: `wrong transaction hash: ${transHash} req: ${JSON.stringify(req)}`,

      title: 'webhook failed no hashed header',

      type: 'error',
      nType: 'both',
      permissions: ['ALL_STAFFS'],
    });
    return;
  }

  switch (req.event) {
    case 'BVN':
      await bvnWebHook(req.data as BVNDetails);
      break;
    case 'Transfer':
    case 'transfer.completed':
      await transferWebHook(req.data as IncomingTransferI);
      break;
    case 'charge.completed':
      await depositWebHook(req.data as IncomingDepositI);
      break;
    default:
      break;
  }
};
