import express from 'express';
import { bitpwrWebhookController, createWebhookController } from './controller.webhooks';
const webhookRouter = express.Router();
webhookRouter.post('/creating-verify-webhook-trans-will-make-necessary-changes-in-the-future', createWebhookController);
webhookRouter.post('/creating-verify-webhook-for-bitpwr', bitpwrWebhookController);
export default webhookRouter;
// webhook.controller.v1.ts
//# sourceMappingURL=webhook.route.v1.js.map