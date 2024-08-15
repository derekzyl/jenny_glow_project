import { auth } from "../auth";
import { allPermissions } from "../setting/roles";
import { validate } from "../validate";
import { Router } from "express";
import { stockController, stockTransferController, stockTransferValidation, stockValidation } from ".";
const stockRouter = Router();
const stockTransferRouter = Router();
stockRouter.route("/").get(auth(allPermissions.Stock.GetAll, allPermissions.Stock.Manage), validate(stockValidation.stockQuerySchema), stockController.getManyStock).post(auth(allPermissions.Stock.Create, allPermissions.Stock.Manage), validate(stockValidation.createStockSchema), stockController.createStock);
stockRouter.route("/:id/stock").get(auth(allPermissions.Stock.Get, allPermissions.Stock.Manage), validate(stockValidation.stockIdParamSchema), stockController.getOneStock).put(auth(allPermissions.Stock.Update, allPermissions.Stock.Manage), validate(stockValidation.updateStockSchema), stockController.updateStock);
stockRouter.route("/:id/stock/add").patch(auth(allPermissions.Stock.Update, allPermissions.Stock.Manage), validate(stockValidation.addToStockSchema), stockController.addToStock);
stockRouter.route("/:id/stock/remove").patch(auth(allPermissions.Stock.Update, allPermissions.Stock.Manage), validate(stockValidation.removeFromStockSchema), stockController.removeStock);
stockRouter.route("/:id/stock/get-by-branch-product").get(auth(allPermissions.Stock.Get, allPermissions.Stock.Manage), stockController.getStockByProductIdAndBranchId);
stockTransferRouter.route("/").post(auth(allPermissions.Stock.Transfer, allPermissions.Stock.Manage), validate(stockTransferValidation.createStockTransferSchema), stockTransferController.createStockTransfer).get(auth(allPermissions.Stock.Transfer, allPermissions.Stock.Manage), validate(stockTransferValidation.stockTransferQuerySchema), stockTransferController.getManyStockTransfer);
stockTransferRouter.route("/:id").get(auth(allPermissions.Stock.Transfer, allPermissions.Stock.Manage), validate(stockTransferValidation.idParamSchema), stockTransferController.getOneStockTransfer).patch(auth(allPermissions.Stock.Transfer, allPermissions.Stock.Manage), validate(stockTransferValidation.updateStockTransferSchema), stockTransferController.updateStockTransfer).delete(auth(allPermissions.Stock.Transfer, allPermissions.Stock.Manage), validate(stockTransferValidation.idParamSchema), stockTransferController.deleteStockTransfer);
stockTransferRouter.route("/:id/status").patch(auth(allPermissions.Stock.Transfer, allPermissions.Stock.Manage), validate(stockTransferValidation.updateStockTransferStatusSchema), stockTransferController.updateStockTransferStatus);
stockTransferRouter.route("/:id/accept-stock-transfer").patch(auth(allPermissions.Stock.Transfer, allPermissions.Stock.Manage), validate(stockTransferValidation.idParamSchema), stockTransferController.acceptStockTransferByBranch);
export { stockRouter, stockTransferRouter };
//# sourceMappingURL=routes.js.map