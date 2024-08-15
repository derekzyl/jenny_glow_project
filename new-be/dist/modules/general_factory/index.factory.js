import { createOne, deleteOne, getAll, getOne, updateOne, } from "./controller.factory";
class GeneralFactory {
    constructor() {
        this.createOneFactory = createOne;
        this.deleteOneFactory = deleteOne;
        this.updateOneFactory = updateOne;
        this.getOneFactory = getOne;
        this.getAllFactory = getAll;
    }
}
export const GeneralIndex = new GeneralFactory();
//# sourceMappingURL=index.factory.js.map