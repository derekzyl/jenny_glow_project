"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffIndex = void 0;
const controller_staff_1 = require("./main_staff/controller.staff");
class Staff {
    constructor() {
        this.create_staff = controller_staff_1.createStaff;
        this.update_staff = controller_staff_1.updateStaff;
        this.get_staff_profile = controller_staff_1.getMyStaffProfile;
        this.get_one_staff = controller_staff_1.getOneStaff;
        this.get_all_staff = controller_staff_1.getAllStaff;
        this.delete_staff = controller_staff_1.deleteStaff;
    }
}
exports.StaffIndex = new Staff();
