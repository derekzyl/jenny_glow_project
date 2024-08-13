import { Router } from 'express';

import { auth } from '@modules/auth';
import { allPermissions } from '@modules/setting/roles';
import { formFileHandler, MULTER_UPLOAD } from '@modules/utils/file_handler/middleware.file';
import { validate } from '@modules/validate';

import { ProductIndex } from '../index.product';
import * as productValidation from '../validation.product';

const productRouter = Router();
const productVariantRouter = Router();

productRouter
  .route('/')
  .post(
    auth(allPermissions.Product.Create),
    validate(productValidation.createProductSchema),
    MULTER_UPLOAD.fields([
      { name: 'image', maxCount: 1 },
      { name: 'otherImage1', maxCount: 1 },
      { name: 'otherImage2', maxCount: 1 },
      { name: 'otherImage3', maxCount: 1 },
    ]),
    formFileHandler([{ name: 'image' }, { name: 'otherImage1' }, { name: 'otherImage2' }, { name: 'otherImage3' }]),
    ProductIndex.create_product
  )
  .get(ProductIndex.get_all_product);
productRouter
  .route('/:id')
  .get(ProductIndex.get_one_product)
  .patch(
    auth(allPermissions.Product.Update),
    MULTER_UPLOAD.fields([
      { name: 'image', maxCount: 1 },
      { name: 'otherImage1', maxCount: 1 },
      { name: 'otherImage2', maxCount: 1 },
      { name: 'otherImage3', maxCount: 1 },
    ]),
    formFileHandler([{ name: 'image' }, { name: 'otherImage1' }, { name: 'otherImage2' }, { name: 'otherImage3' }]),
    validate(productValidation.updateProductSchema),
    ProductIndex.update_product
  )
  .delete(auth(allPermissions.Product.Delete), validate(productValidation.idParamSchema), ProductIndex.delete_product);

productVariantRouter
  .route('/')
  .post(
    auth(allPermissions.Product.Create),
    validate(productValidation.createProductVariantSchema),
    MULTER_UPLOAD.fields([
      { name: 'image', maxCount: 1 },
   
    ]),
    formFileHandler([{ name: 'image' }, ]),
    ProductIndex.create_product_variant
  )
  .get(ProductIndex.get_all_product);
productVariantRouter
  .route('/:id')
  .get(ProductIndex.get_one_product_variant)
  .patch(
    auth(allPermissions.Product.Update),
    validate(productValidation.updateProductVariantSchema),
    MULTER_UPLOAD.fields([
      { name: 'image', maxCount: 1 },

    ]),
    formFileHandler([{ name: 'image' }]),
    ProductIndex.update_product_variant
  )
  .delete(auth(allPermissions.Product.Delete), validate(productValidation.idParamSchema), ProductIndex.delete_product_variant);

export { productRouter, productVariantRouter };
