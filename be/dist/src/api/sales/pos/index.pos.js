"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PosIndex = void 0;
const controller_pos_1 = require("./main_pos/controller.pos");
class Pos {
    constructor() {
        this.create_pos = controller_pos_1.createPos;
        this.get_one_pos = controller_pos_1.getOnePos;
        this.get_all_pos = controller_pos_1.getManyPos;
        this.update_pos = controller_pos_1.updatePos;
        this.delete_pos = controller_pos_1.deletePos;
        this.get_products = controller_pos_1.getManyPosProduct;
    }
}
exports.PosIndex = new Pos();
