import { Request, Response } from "express";

import { PROFILE } from "./model.profile";

import { catchAsync } from "@modules/utils";
import { CrudService } from "expressbolt";
import httpStatus from "http-status";
import {
  ProfileI
} from "../interface_profile/interface.profile";

//todo profile receipt

export const createProfile = catchAsync(async (
  request: Request,
  response: Response,
) => {
  const profile = await CrudService.create<ProfileI>({
    check: {}, 
    data: request.body,
    modelData: {
      Model:PROFILE, select:[]
    }
  })
  response.status(httpStatus.CREATED).send(profile)
});

export const getOneProfileByUserId =catchAsync( async (
  request: Request,
  response: Response,
) => {
  const getProfile = await CrudService.getOne<ProfileI>({
    data: { userId: request.user.id }, modelData: {
      Model: PROFILE, select:[]
      
    }, populate: {
      path: 'userId',
      fields:['-password']
    }
  })
  response.send(getProfile)
});
export const getOneProfileById =catchAsync( async (
  request: Request,
  response: Response,
) => {
  const getProfile = await CrudService.getOne<ProfileI>({
    data: { id: request.params['id'] }, modelData: {
      Model: PROFILE, select:[]
      
    }, populate: {
      path: 'userId',
      fields:['-password']
    }
  })
  response.send(getProfile)
});

export const getManyProfile = catchAsync(async (
  request: Request,
  response: Response,
) => {
  const getMany = await CrudService.getMany<ProfileI>({
    filter: {},
    query: request.query,
    modelData: {
      Model: PROFILE,
      select:[]
    },populate:{}
  })
  response.send(getMany)
});

export const updateProfileById = catchAsync(async (
  request: Request,
  response: Response,
) => {
  const body = request.body;

  const update = await CrudService.update<ProfileI>({
    data: body,
    filter: { id: request.params['id'] },
    modelData: {
      Model:PROFILE,select:[]
    }
  })
  response.send(update)
});
export const updateProfileByUserId = catchAsync(async (
  request: Request,
  response: Response,
) => {
  const body = request.body;

  const update = await CrudService.update<ProfileI>({
    data: body,
    filter: { userId:request.user.id },
    modelData: {
      Model:PROFILE,select:[]
    }
  })
  response.send(update)
});

export const deleteProfileById =catchAsync( async (
  request: Request,
  response: Response,
) => {
  const del = await CrudService.delete<ProfileI>({
    data: { id: request.params['id'] }, modelData: {
    Model:PROFILE, select:[]
  }
  })
  response.send(del)
});
export const deleteProfileByUserId =catchAsync( async (
  request: Request,
  response: Response,
) => {
  const del = await CrudService.delete<ProfileI>({
    data: { userId:request.user.id }, modelData: {
    Model:PROFILE, select:[]
  }
  })
  response.send(del)
});
