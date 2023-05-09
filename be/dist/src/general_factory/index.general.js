"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralFactory = void 0;
const controller_factory_1 = require("./controller.factory");
const permission_handler_1 = require("./permission_handler");
class GeneralFactory {
    constructor() {
        this.createOneFactory = controller_factory_1.createOne;
        this.deleteOneFactory = controller_factory_1.deleteOne;
        this.updateOneFactory = controller_factory_1.updateOne;
        this.getOneFactory = controller_factory_1.getOne;
        this.getAllFactory = controller_factory_1.getAll;
        this.getUserPermissions = permission_handler_1.getPermissions;
    }
}
exports.GeneralFactory = GeneralFactory;
