"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchIndex = void 0;
const controller_branch_1 = require("./main_branch/controller.branch");
class Branch {
    constructor() {
        this.created_branch = controller_branch_1.createBranch;
        this.get_one_branch = controller_branch_1.getOneBranch;
        this.update_branch = controller_branch_1.updateBranch;
        this.delete_branch = controller_branch_1.deleteBranch;
        this.get_all_branch = controller_branch_1.getAllBranch;
    }
}
exports.BranchIndex = new Branch();
