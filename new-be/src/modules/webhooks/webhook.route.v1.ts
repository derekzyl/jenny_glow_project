import express, { Router } from 'express';
import { bitpwrWebhookController, createWebhookController } from './controller.webhooks';

const webhookRouter: Router = express.Router();

webhookRouter.post('/creating-verify-webhook-trans-will-make-necessary-changes-in-the-future', createWebhookController);
webhookRouter.post('/creating-verify-webhook-for-bitpwr', bitpwrWebhookController);
export default webhookRouter;

// webhook.controller.v1.ts
