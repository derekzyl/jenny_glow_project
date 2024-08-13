import { auth } from '../../auth';
import { validate } from '../../validate';
import express from 'express';
import { exchangeEngineController, exchangeEngineValidation } from '..';
import { allPermissions } from '../../setting/roles';
const router = express.Router();
router
    .route('/')
    .post(auth(allPermissions.Exchanges.Create, allPermissions.SuperAdmin), validate(exchangeEngineValidation.addExchange), exchangeEngineController.addExchange)
    .get(auth(allPermissions.Exchanges.Get, allPermissions.SuperAdmin), validate(exchangeEngineValidation.getAllExchanges), exchangeEngineController.getAllExchanges);
router
    .route('/:exchangeId')
    .get(auth(allPermissions.Exchanges.Get, allPermissions.SuperAdmin), validate(exchangeEngineValidation.getExchange), exchangeEngineController.getExchange)
    .patch(auth(allPermissions.Exchanges.Update, allPermissions.SuperAdmin), validate(exchangeEngineValidation.updateExchange), exchangeEngineController.updateExchange)
    .put(auth(allPermissions.Exchanges.Deactivate, allPermissions.SuperAdmin), validate(exchangeEngineValidation.deactivateExchange), exchangeEngineController.deactivateExchange)
    .delete(auth(allPermissions.Exchanges.Delete, allPermissions.SuperAdmin), validate(exchangeEngineValidation.deleteExchange), exchangeEngineController.deleteExchange);
export default router;
//# sourceMappingURL=exchange.route.v1.js.map