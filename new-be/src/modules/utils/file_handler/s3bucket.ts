import AWS from 'aws-sdk';
import { Readable } from 'stream';

class S3Handler {
  private s3: AWS.S3;
  private bucketName: string;

  constructor() {
    this.s3 = new AWS.S3();
    this.bucketName = 'bucketName';
  }

  /**
   * Uploads a file to S3 bucket and returns the file URL.
   * @param fileBuffer The buffer of the file.
   * @param folderPath The folder path where the file will be stored in the bucket.
   * @param fileName The name of the file.
   * @returns The URL of the uploaded file.
   */
  async uploadFile(fileBuffer: Buffer, folderPath: string, fileName: string): Promise<string> {
    const key = `${folderPath}/${fileName}`;

    const params: AWS.S3.Types.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: key,
      Body: fileBuffer,
      ACL: 'public-read', // Set ACL as needed (public-read for public access)
    };

    await this.s3.upload(params).promise();

    // Construct the URL of the uploaded file
    const fileUrl = `https://${this.bucketName}.s3.amazonaws.com/${key}`;

    return fileUrl;
  }

  /**
   * Deletes a file from the S3 bucket.
   * @param fileKey The key of the file to be deleted.
   */
  async deleteFile(fileKey: string): Promise<void> {
    const params: AWS.S3.Types.DeleteObjectRequest = {
      Bucket: this.bucketName,
      Key: fileKey,
    };

    await this.s3.deleteObject(params).promise();
  }

  /**
   * Uploads a file to S3 bucket using a Readable stream and returns the file URL.
   * @param readableStream Readable stream containing the file data.
   * @param folderPath The folder path where the file will be stored in the bucket.
   * @param fileName The name of the file.
   * @returns The URL of the uploaded file.
   */
  async uploadFileFromStream(buffer: Buffer, folderPath: string, fileName: string): Promise<string> {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    const key = `${folderPath}/${fileName}`;

    const params: AWS.S3.Types.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: key,
      Body: stream,
      ACL: 'public-read', // Set ACL as needed (public-read for public access)
    };

    const uploadResult = await this.s3.upload(params).promise();

    // Construct the URL of the uploaded file
    const fileUrl = uploadResult.Location || '';

    return fileUrl;
  }
}

export default S3Handler;
