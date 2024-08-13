/** @format */

import * as dotenv from 'dotenv';
// import * as streamifier from "readable-stream";
import { Readable } from 'stream';

import { ApiError } from '@modules/errors';
import { logger } from '@modules/logger';
import { v2 as cloudinary } from 'cloudinary';
import httpStatus from 'http-status';
import config from '../../../config/config';

dotenv.config();

cloudinary.config({
  cloud_name: 'cybergenii',
  api_key: config.cloudinaryAPI.key,
  api_secret: config.cloudinaryAPI.secret,
  secure: true,
});

class CloudinaryHandler {
  /**
   *
   * @param {String} file - this takes either an image buffer or request.file.path
   * @param link -expecting a defined folder and a user specified folder to promote good arrangements
   * @returns an object of cloudinary
   *
   * @example
   * ```ts
   * const { path } = req.file;

    // Upload the PDF file to Cloudinary
    const uploadedFile = await cloudinary.uploader.upload(path, {
      folder: 'pdfs'
    });
    // or

      const { path } = req.file;

    // Resize the image using Sharp
    const resizedImage = await sharp(path).resize(800, 600).toBuffer();

    // Upload the resized image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(resizedImage, {
      folder: 'images'
    });
   * ```
   */
  static async uploadImageOrFileToCloudinary(file: Buffer, link: string) {
    return new Promise<any>((resolve, reject) => {
      const cldUploadStream = cloudinary.uploader.upload_stream({ folder: link }, function (error, result) {
        // console.log(error, result);
        if (error) reject(error);
        if (result) {
          resolve(result.secure_url);
        }
      });
      const n = new Readable({
        read() {
          this.push(file);
          this.push(null);
        },
      });
      n.pipe(cldUploadStream);

      // const uploaded_data = await cloudinary.uploader.upload(file);
    });
  }

  /**
   * The function deletes a file from Cloudinary using the provided file ID.
   * @param {string} file_id - The `file_id` parameter is a string that represents the unique
   * identifier of the file in Cloudinary that you want to delete.
   * @returns an instance of the `ApiError` class if an error occurs while deleting the file.
   */
  static async deleteFileFromCloudinary(file_id: string) {
    try {
      await cloudinary.uploader.destroy(file_id);
    } catch (error: any) {
      logger.error('error occurred deleting file', error);
      throw new ApiError(httpStatus.BAD_REQUEST, 'error deleting file');
    }
  }
}

// cloudinary response DataTransfer

// 1] {
//  asset_id: '5355b5ed158bc4ea2fe19ef14aa45596',
//  public_id: 'cybersgenii/image/huotirmygadzj7jaggfo',
//  version: 1687840447,
//  version_id: '8dc1e47ff4ef5faaac56628832e6c30e',
//  signature: 'd8fbeca9e5cb65863ba98bccd9c448ae84064318',
//  width: 500,
//  height: 500,
//  format: 'jpg',
//  resource_type: 'image',
//  created_at: '2023-06-27T04:34:07Z',
//  tags: [],
//  bytes: 33985,
//  type: 'upload',
//  etag: 'a394a1f56a2b2ffe0a22563ff99f7980',
//  placeholder: false,
//  url: 'http://res.cloudinary.com/cybergenii/image/upload/v1687840447/cybersgenii/image/huotirmygadzj7jaggfo.jpg',
//  secure_url: 'https://res.cloudinary.com/cybergenii/image/upload/v1687840447/cybersgenii/image/huotirmygadzj7jaggfo.jpg',
//  folder: 'cybersgenii/image',
//  original_filename: 'file',
//  api_key: '148834358482124'
//   [1] } this is a result sheet

export default CloudinaryHandler;
