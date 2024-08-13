/* eslint-disable @typescript-eslint/naming-convention */
import { TransactionEvent } from '@modules/bitpwr/interfaces/interface.webhook.bitpwr';
import { handleBitpwrTransactionEvent, isBitPwrWebhookValid } from '@modules/bitpwr/wehook.bitpwr';
import { notificationService } from '@modules/notification';
import { catchAsync } from '@modules/utils';
import { Request, Response } from 'express';
import { webhookService } from '.';
import { WebhookEvent } from './interfaces/transfer.webhook';

export const createWebhookController = catchAsync(async (req: Request, res: Response) => {
  // lets give it a try here

  const { body, headers } = req;

  const b: WebhookEvent = body!;
  const verify_hash: string | undefined | string[] = headers['verif-hash'];
  if (!verify_hash || Array.isArray(verify_hash) || verify_hash === undefined) {
    await notificationService.sendNotificationToStaffs({
      body: `NO HEADER FOUND: ${JSON.stringify(body)} headers ${JSON.stringify(headers)}`,

      title: 'webhook failed no hashed header',

      type: 'error',
      nType: 'both',
      permissions: ['ALL_STAFFS'],
    });
    return;
  }

  await webhookService({ ...b }, verify_hash);
  res.sendStatus(200);
});

export const bitpwrWebhookController = catchAsync(async (req: Request, res: Response) => {
  const { body, headers } = req;
  const hashedHeader: string | undefined | string[] = headers['x-webhook-secret'];
  await notificationService.sendNotificationToStaffs({
    body: `incoming ${JSON.stringify(body)} headers ${JSON.stringify(headers)}`,

    title: 'BITPWR',

    type: 'INCOMING',
    nType: 'both',
    permissions: ['ALL_STAFFS'],
  });
  if (!hashedHeader || Array.isArray(hashedHeader) || hashedHeader === undefined) {
    await notificationService.sendNotificationToStaffs({
      body: `a notification from bitpwr is not found: the data details is  order details is: ${JSON.stringify(
        body
      )} \n headers ${JSON.stringify(headers)}`,

      title: 'webhook failed no hashed header',

      type: 'error',
      nType: 'both',
      permissions: ['ALL_STAFFS'],
    });
    return;
  }
  const isValidHeader = isBitPwrWebhookValid(hashedHeader);
  if (!isValidHeader) {
    await notificationService.sendNotificationToStaffs({
      body: `a notification ${hashedHeader} from bitpwr is not found: the data details is order details is: ${JSON.stringify(
        body
      )}`,

      title: 'webhook failed with invalid header',

      type: 'error',
      nType: 'both',
      permissions: ['ALL_STAFFS'],
    });
    return;
  }
  const b: TransactionEvent = body;
  await handleBitpwrTransactionEvent(b);
  res.sendStatus(200);
});
