import { createVat, deleteVat, getManyVat, getOneVat, updateVat, } from "./main_vat/controller.vat";
class Vat {
    constructor() {
        this.create_vat = createVat;
        this.get_one_vat = getOneVat;
        this.get_all_vat = getManyVat;
        this.update_vat = updateVat;
        this.delete_vat = deleteVat;
    }
}
export const VatIndex = new Vat();
//# sourceMappingURL=index.vat.js.map