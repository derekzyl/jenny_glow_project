import { logger } from '../logger';
import { notificationService } from '../notification';
import { bvnWebHook } from './services/service.bvn.webhook';
import { depositWebHook, transferWebHook } from './services/service.transfers.webhook';
import { transactionnHash } from './services/service.verify-hash';
export const webhookService = async (req, transHash) => {
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
            await bvnWebHook(req.data);
            break;
        case 'Transfer':
        case 'transfer.completed':
            await transferWebHook(req.data);
            break;
        case 'charge.completed':
            await depositWebHook(req.data);
            break;
        default:
            break;
    }
};
//# sourceMappingURL=index.js.map