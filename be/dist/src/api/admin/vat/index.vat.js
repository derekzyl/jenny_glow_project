"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VatIndex = void 0;
const controller_vat_1 = require("./main_vat/controller.vat");
class Vat {
    constructor() {
        this.create_vat = controller_vat_1.createVat;
        this.get_one_vat = controller_vat_1.getOneVat;
        this.get_all_vat = controller_vat_1.getManyVat;
        this.update_vat = controller_vat_1.updateVat;
        this.delete_vat = controller_vat_1.deleteVat;
    }
}
exports.VatIndex = new Vat();
