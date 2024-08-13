import { handleBitpwrTransactionEvent, isBitPwrWebhookValid } from '../bitpwr/wehook.bitpwr';
import { notificationService } from '../notification';
import { catchAsync } from '../utils';
import { webhookService } from '.';
export const createWebhookController = catchAsync(async (req, res) => {
    // lets give it a try here
    const { body, headers } = req;
    const b = body;
    const verify_hash = headers['verif-hash'];
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
    await webhookService(Object.assign({}, b), verify_hash);
    res.sendStatus(200);
});
export const bitpwrWebhookController = catchAsync(async (req, res) => {
    const { body, headers } = req;
    const hashedHeader = headers['x-webhook-secret'];
    await notificationService.sendNotificationToStaffs({
        body: `incoming ${JSON.stringify(body)} headers ${JSON.stringify(headers)}`,
        title: 'BITPWR',
        type: 'INCOMING',
        nType: 'both',
        permissions: ['ALL_STAFFS'],
    });
    if (!hashedHeader || Array.isArray(hashedHeader) || hashedHeader === undefined) {
        await notificationService.sendNotificationToStaffs({
            body: `a notification from bitpwr is not found: the data details is  order details is: ${JSON.stringify(body)} \n headers ${JSON.stringify(headers)}`,
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
            body: `a notification ${hashedHeader} from bitpwr is not found: the data details is order details is: ${JSON.stringify(body)}`,
            title: 'webhook failed with invalid header',
            type: 'error',
            nType: 'both',
            permissions: ['ALL_STAFFS'],
        });
        return;
    }
    const b = body;
    await handleBitpwrTransactionEvent(b);
    res.sendStatus(200);
});
//# sourceMappingURL=controller.webhooks.js.map