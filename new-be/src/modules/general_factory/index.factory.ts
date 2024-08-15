import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./controller.factory";


class GeneralFactory {
  public createOneFactory = createOne;
  public deleteOneFactory = deleteOne;
  public updateOneFactory = updateOne;
  public getOneFactory = getOne;
  public getAllFactory = getAll;

}


export const GeneralIndex = new GeneralFactory()