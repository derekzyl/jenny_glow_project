import { Request, Response } from "express";

import { catchAsync } from "@modules/utils";
import { CrudService } from "expressbolt";
import { VatI } from "../interface_vat/interface.vat";
import { VAT } from "./model.vat";

export const createVat = catchAsync(async (
  request: Request,
  response: Response,

) => {

    const body = request.body;


  const crud = await CrudService.create<VatI>({
    check: {},
    data: body, modelData: {
      Model:VAT,select:[]
    }
    
  })

  response.status(201).send(crud)

});

export const getOneVat = catchAsync(async (
  request: Request,
  response: Response,

) => {
  
  const getOne = CrudService.getOne<VatI>({
    data: { id: request.params['id'] }, modelData: {
      Model: VAT,
      select:[]
    },populate:{}
  });
  response.send(getOne)
});

export const getManyVat = async (
  request: Request,
  response: Response,

) => {
 
  const getMany = CrudService.getMany<VatI>({
    filter: {}, modelData: {
      Model:VAT, select:[]
    },populate:{}, query:request.query
  })
  response.send(getMany)
};

export const updateVat = catchAsync(async (
  request: Request,
  response: Response,

) => {

  const update = CrudService.update<VatI>({
    data: request.body, filter: { id: request.params['id'] }, modelData: {
      Model:VAT, select:[]
    }
  })
  response.send(update)
});
export const deleteVat = catchAsync(async (
  request: Request,
  response: Response,

) => {

  const delet = await CrudService.delete<VatI>({
    data: { id: request.params['id'] }, modelData: {
      Model:VAT, select:[]
    }
  })
  response.send(delet)
});
