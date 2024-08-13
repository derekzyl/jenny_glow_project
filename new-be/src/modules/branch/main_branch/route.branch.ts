import { auth } from "@modules/auth";
import { allPermissions } from "@modules/setting/roles";
import { validate } from "@modules/validate";
import { Router } from "express";
import { branchController, branchValidation } from "..";

const branchRouter = Router();

branchRouter
  .route("/")
  .post(
    auth(allPermissions.Branch.Create),
  validate(branchValidation.createBranch),
    branchController.createBranch
  )
  .get(
    auth(allPermissions.Branch.GetAll),
    validate(branchValidation.getAllBranch),
    branchController.getAllBranch

  );
branchRouter
  .route("/:id")
  .get(
    auth(allPermissions.Branch.Get),
    validate(branchValidation.getOneBranch),
    branchController.getOneBranch
  )
  .patch(
    auth(allPermissions.Branch.Update),
  validate(branchValidation.updateBranch),
    branchController.updateBranch
  )
  .delete(
   auth(allPermissions.Branch.Update),
    validate(branchValidation.deleteBranch),
    branchController.deleteBranch
  );
branchRouter
  .route('/:id/branch-name')
  .get(auth(allPermissions.Branch.Get), validate(branchValidation.getOneBranch), branchController.getBranchByName);
branchRouter
  .route('/:id/branch-code')
  .get(auth(allPermissions.Branch.Get), validate(branchValidation.getOneBranch), branchController.getBranchByCode);


export default branchRouter;
