import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  // Maximum allowed file size: 5MB
  private readonly MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

  // S3 bucket name and client instance
  private readonly bucketName: string;
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  /**
   * Uploads a file to a specified folder in the S3 bucket.
   *
   * Validates the file size is under 5 MB.
   *
   * @param file - The file to be uploaded (provided by Multer).
   * @param folder - The target folder within the bucket.
   * @returns The public URL of the uploaded file.
   * @throws {BadRequestException} If the file size exceeds 5 MB.
   */
  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    // Validate file size before uploading.
    if (file.size > this.MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException('File size exceeds the 5MB limit.');
    }

    const key = `${folder}/${file.originalname}`;
    const uploadParams = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    // Upload the file to S3.
    const command = new PutObjectCommand(uploadParams);
    await this.s3Client.send(command);

    return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
  }

  /**
   * Retrieves a file from S3.
   *
   * @param fileKey - The S3 key of the file.
   * @returns A Promise resolving to the file's data as a Buffer.
   */
  async getFile(fileKey: string): Promise<Buffer> {
    const getParams = {
      Bucket: this.bucketName,
      Key: fileKey,
    };

    // Send the request to get the file.
    const command = new GetObjectCommand(getParams);
    const data = await this.s3Client.send(command);

    // For a more robust solution, you might need to convert the stream to a buffer.
    return data.Body as Buffer;
  }

  /**
   * Deletes a single file from the S3 bucket.
   *
   * @param fileKey - The S3 key of the file to delete.
   */
  async deleteFile(fileKey: string): Promise<void> {
    const deleteParams = {
      Bucket: this.bucketName,
      Key: fileKey,
    };

    // Delete the file from S3.
    const command = new DeleteObjectCommand(deleteParams);
    await this.s3Client.send(command);
  }

  /**
   * Lists all files within a specific folder in the bucket.
   *
   * @param folder - The folder within the bucket.
   * @returns An array of file keys.
   */
  async listFiles(folder: string): Promise<string[]> {
    const listParams = {
      Bucket: this.bucketName,
      Prefix: folder,
    };

    // Retrieve the list of objects.
    const command = new ListObjectsV2Command(listParams);
    const data = await this.s3Client.send(command);

    // Return an array of file keys or an empty array if none exist.
    return data.Contents?.map((item) => item.Key!) || [];
  }

  /**
   * Deletes all files within a specific folder.
   *
   * Uses bulk deletion for improved performance.
   *
   * @param folder - The folder from which to delete all files.
   */
  async deleteFiles(folder: string): Promise<void> {
    // Retrieve the list of files in the specified folder.
    const files = await this.listFiles(folder);

    // If no files are found, exit early.
    if (files.length === 0) return;

    const deleteParams = {
      Bucket: this.bucketName,
      Delete: {
        Objects: files.map((file) => ({ Key: file })),
      },
    };

    // Delete all files at once using DeleteObjectsCommand.
    const command = new DeleteObjectsCommand(deleteParams);
    await this.s3Client.send(command);
  }
}
