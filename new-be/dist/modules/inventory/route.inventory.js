import { auth } from '../auth';
import { allPermissions } from '../setting/roles';
import { formFileHandler, MULTER_UPLOAD } from '../utils/file_handler/middleware.file';
import { validate } from '../validate';
import { Router } from 'express';
import * as inventoryController from './main_inventory/controller.inventory';
import * as inventoryValidation from './validation.inventory';
const inventoryRouter = Router();
inventoryRouter
    .post('/', auth(allPermissions.Inventory.Create, allPermissions.Inventory.CreateBranchInventory), validate(inventoryValidation.createInventorySchema), MULTER_UPLOAD.fields([{ name: 'inventoryReceipt', maxCount: 1 }]), formFileHandler([{ name: 'inventoryReceipt' }]), inventoryController.createInventory)
    .get('/', auth(allPermissions.Inventory.GetAll), validate(inventoryValidation.inventoryQuerySchema), inventoryController.getManyInventory)
    .patch('/update/:id', auth(allPermissions.Inventory.Update, allPermissions.Inventory.UpdateBranchInventory), validate(inventoryValidation.updateInventoryStatusSchema), MULTER_UPLOAD.fields([{ name: 'inventoryReceipt', maxCount: 1 }]), formFileHandler([{ name: 'inventoryReceipt' }]), inventoryController.updateInventory)
    .delete('/delete/:id', auth(allPermissions.Inventory.Delete, allPermissions.Inventory.DeleteBranchInventory), validate(inventoryValidation.idParamSchema), inventoryController.deleteInventory)
    .get('/get/:id', auth(allPermissions.Inventory.Get, allPermissions.Inventory.GetBranchInventory), inventoryController.getOneInventory)
    .get('/get-by-user-id', auth(allPermissions.Inventory.GetAll, allPermissions.Inventory.GetAllBranchInventory), inventoryController.getBranchInventoryByUserId)
    .get('/get-by-manager-id', auth(allPermissions.Inventory.GetAll, allPermissions.Inventory.GetAllBranchInventory), inventoryController.getBranchInventoryByManagerId)
    .get('/get-by-branch-id', auth(allPermissions.Inventory.GetAll, allPermissions.Inventory.GetAllBranchInventory), inventoryController.getBranchInventory)
    .patch('/approve/:id', auth(allPermissions.Inventory.Approve), inventoryController.approveInventory); // approve inventory
export default inventoryRouter;
//# sourceMappingURL=route.inventory.js.map