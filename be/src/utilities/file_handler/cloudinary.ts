/** @format */

import * as dotenv from "dotenv";
// import * as streamifier from "readable-stream";
import { Readable } from "stream";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "cybergenii",
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

export class CloudinaryHandler {
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
  async uploadImageOrFileToCloudinary(file: any, link: string) {
    return new Promise<any>((resolve, reject) => {
      const cld_upload_stream = cloudinary.uploader.upload_stream(
        { folder: link },
        function (error, result) {
          console.log("error");

          // console.log(error, result);
          if (error) reject(error);
          if (result) resolve(result.secure_url);
        }
      );
      const n = new Readable({
        read() {
          this.push(file);
          this.push(null);
        },
      });
      n.pipe(cld_upload_stream);

      // const uploaded_data = await cloudinary.uploader.upload(file);
    });
  }
}
