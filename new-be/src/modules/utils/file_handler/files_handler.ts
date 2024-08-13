import sharp from 'sharp';

// todo sharp lets go

import CloudinaryHandler from './cloudinary';
import { FilePropertyI, FileValueI } from './file_handler.interface';
import S3Handler from './s3bucket';

/* The `FileHandler` class is responsible for handling file properties and performing operations such
as resizing images and uploading files to cloud storage services. */
export class FileHandler implements FilePropertyI {
  fileData: Buffer;

  sharp: sharp.Sharp;

  imageWidth: number | undefined;

  imageHeight: number | undefined;

  imageText: string;

  fileType: string;

  fileExtName: string;

  fileFolder: string;

  fileName: string;

  cloudStorageType: 'AWS' | 'CLOUDINARY';

  /**
   * The constructor function initializes the properties of a class instance based on the provided file
   * value.
   * @param {FileValueI} fileValue - The `fileValue` parameter is an object that contains the following
   * properties:
   */
  constructor(fileValue: FileValueI) {
    this.fileData = fileValue.fileData.buffer;
    this.fileFolder = fileValue.fileFolder;
    this.imageWidth = fileValue.imageWidth;
    this.imageHeight = fileValue.imageHeight;
    this.sharp = sharp(this.fileData);
    this.imageText = fileValue.imageText ?? '';
    this.fileName = fileValue.fileData.originalName;

    const [fileType, fileExtName] = fileValue.fileData.mimetype.split('/');
    this.fileType = fileType!;
    this.fileExtName = fileExtName!;
    this.cloudStorageType = 'CLOUDINARY';

    this.getHandler();
  }

  // file_data: Buffer;

  /**
   * The function `_getHandler` returns a specific handler based on the file type, or throws an error
   * if the file type is unsupported.
   * @returns The function `_getHandler()` returns either the result of calling `this.imageHandler()`
   * or `this.fileHandler()` depending on the value of `this.fileType`. If `this.fileType` is
   * `'image'`, then `this.imageHandler()` is returned. If `this.fileType` is `'application'`, then
   * `this.fileHandler()` is returned. If `this.fileType` is
   */
  private getHandler() {
    if (this.fileType === 'image') {
      return this.imageHandler();
    }
    if (this.fileType === 'application') {
      return this.fileHandler();
    }
    throw new Error('Unsupported file type');
  }

  /**
   * The `imageHandler` function generates an SVG image with specified dimensions and text, then
   * resizes it, composites it with another image, and uploads it to either Cloudinary or AWS S3 based
   * on the specified cloud storage type.
   * @returns The function `imageHandler()` returns the result of uploading the image to either
   * Cloudinary or AWS S3, depending on the value of `this.cloudStorageType`.
   */
  public async imageHandler() {
    const svgImg = /* html */ `
    <svg width="${this.imageWidth}" height="${this.imageHeight}">
      <style>
      .title { fill: #001; font-size: 70px; font-weight: bold;}
      </style>
      <text x="50%" y="50%" text-anchor="middle" class="title">${this.imageText}</text>
    </svg>
`;

    const svgBuffer = Buffer.from(svgImg);
    const val =
      this.imageHeight && this.imageWidth
        ? await this.sharp
            .resize({
              width: this.imageWidth,
              height: this.imageHeight,
            })
            .composite([
              {
                input: svgBuffer,
                top: 0,
                left: 0,
              },
            ])
            .jpeg({ quality: 90 })
            .toBuffer()
        : await this.sharp
            .composite([
              {
                input: svgBuffer,
                top: 0,
                left: 0,
              },
            ])
            .jpeg({ quality: 90 })
            .toBuffer();
    switch (this.cloudStorageType) {
      case 'CLOUDINARY': {
        const v = await CloudinaryHandler.uploadImageOrFileToCloudinary(val, this.fileFolder);

        return v;
      }
      case 'AWS': {
        const w = new S3Handler();
        return w.uploadFileFromStream(val, this.fileFolder, this.fileName);
      }
      default:
        throw new Error('Unsupported file type');
    }
  }

  /**
   * The fileHandler function uploads an image or file to Cloudinary and returns the result.
   * @returns The variable `v` is being returned.
   */
  public async fileHandler() {
    const v = await CloudinaryHandler.uploadImageOrFileToCloudinary(this.fileData, this.fileFolder);
    // writeFinga`1le(`uploads/${this.user}/${this.file_name}`, this.file_data, (err) =>
    //   console.log(err)
    // );
    // return this.file_name;
    return v;
  }
}

/**
 * The function `fileHandler` takes a file name as input, extracts the public ID from it, and then
 * deletes the corresponding file from Cloudinary.
 * @param {string} file_name - The `file_name` parameter is a string that represents the path of a
 * file.
 */
async function fileHandler(file_name: string) {
  const getPublicId = file_name.split('/').slice(-2);
  const image = getPublicId[1]?.split('.')[0];
  const publicId = `${getPublicId[0]}/${image}`;

  await CloudinaryHandler.deleteFileFromCloudinary(publicId);
}

/**
 * The function `imageDeleteHandler` is an asynchronous function that handles the deletion of image
 * files from either AWS or Cloudinary, depending on the specified type.
 * @param {string | string[]} fileNames - A string or an array of strings representing the names of the
 * files to be deleted.
 * @param {'AWS' | 'CLOUDINARY'} [type=CLOUDINARY] - The `type` parameter is a string that specifies
 * the type of image storage service to use. It can have two possible values: 'AWS' or 'CLOUDINARY'.
 * @returns a Promise that resolves to an array of PromiseSettledResults.
 */
export async function imageDeleteHandler(fileNames: string | string[], type: 'AWS' | 'CLOUDINARY' = 'CLOUDINARY') {
  switch (type) {
    case 'CLOUDINARY': {
      const promises =
        fileNames instanceof Array ? fileNames.map((fileName) => fileHandler(fileName)) : [fileHandler(fileNames)];
      return Promise.allSettled(promises);
    }
    case 'AWS': {
      const aws = new S3Handler();
      const promises =
        fileNames instanceof Array
          ? fileNames.map(async (fileName) => aws.deleteFile(fileName))
          : [await aws.deleteFile(fileNames)];
      return Promise.allSettled(promises);
    }
    default: {
      return null;
    }
  }
}
