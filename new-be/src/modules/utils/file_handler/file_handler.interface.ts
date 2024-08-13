/** @format */

export interface FilePropertyI {
  fileData: Buffer;
}

export interface FileValueI {
  fileData: FileDataI;
  imageWidth?: number;
  imageHeight?: number;
  imageText?: string;
  fileFolder: string;
}
export interface FileDataI {
  fieldName: string;
  originalName: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export enum FileTypeE {
  IMAGE = 'IMAGE',
  APPLICATION = 'APPLICATION',
}

// lets create the file directory format
// 'folder/user/user_model/data'
