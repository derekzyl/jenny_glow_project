"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleIndex = void 0;
const controller_role_1 = require("./main_role/controller.role");
class RolIndex {
    constructor() {
        this.createRole = controller_role_1.createRole;
        this.getAllRole = controller_role_1.getAllRole;
        this.updateRole = controller_role_1.updateOneRole;
        this.deleteRole = controller_role_1.deleteOneRole;
    }
}
exports.RoleIndex = new RolIndex();