import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
  // Maximum allowed file size: 5MB
  private readonly ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
  ];
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
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  /**
   * UTILITIES
   * This section contains utility functions for file validation and processing.
   * These functions are used internally and are not exposed as part of the public API.
   */

  /**
   * Uploads a file to a specified folder in the S3 bucket.
   *
   * Validates the file size is under 5 MB.
   *
   * @param file - The file to be uploaded
   * @param folder - The target folder within the bucket.
   * @returns The public URL of the uploaded file.
   * @throws {BadRequestException} If the file size exceeds 5 MB.
   * @throws {BadRequestException} If the file type is not allowed.
   * @throws {Error} If the upload fails.
   */
  async uploadFile(
    file: import('multer').File | File,
    folder: string,
  ): Promise<string> {
    // Validate file size before uploading.
    if (file.size > this.MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException(
        `File size exceeds the maximum limit of ${
          this.MAX_FILE_SIZE_BYTES / 1024 / 1024
        } MB.`,
      );
    } else if (
      !this.ALLOWED_FILE_TYPES.includes(
        'type' in file ? file.type : file.mimetype,
      )
    ) {
      throw new BadRequestException(
        `Invalid file type. Allowed types are: ${this.ALLOWED_FILE_TYPES.join(
          ', ',
        )}.`,
      );
    }

    try {
      // Create a unique filename to prevent overwriting
      const fileName = `${Date.now()}-${
        'name' in file ? file.name : file.originalname
      }`;

      // Create the upload parameters.
      const uploadParams = {
        Bucket: this.bucketName,
        Key: `${folder}/${fileName}`,
        Body: 'buffer' in file ? file.buffer : file,
        ContentType: 'type' in file ? file.type : file.mimetype,
      };

      // Send the request to upload the file.
      const command = new PutObjectCommand(uploadParams);
      await this.s3Client.send(command);

      // Return the public URL of the uploaded file.
      return `https://${this.bucketName}.s3.amazonaws.com/${uploadParams.Key}`;
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  /**
   * Retrieves a file from S3.
   *
   * @param fileKey - The S3 key of the file.
   * @returns Object containing the file buffer, filename, and content type.
   * @throws {NotFoundException} If the file is not found.
   */
  async getFile(fileKey: string): Promise<{
    content: Buffer;
    filename: string;
    contentType: string;
  }> {
    const params = {
      Bucket: this.bucketName,
      Key: fileKey,
    };

    try {
      const command = new GetObjectCommand(params);
      const data = await this.s3Client.send(command);

      if (!data.Body) {
        throw new NotFoundException(`File not found: ${fileKey}`);
      }

      // Get buffer using modern approach
      const content = Buffer.from(await data.Body.transformToByteArray());

      // Extract filename from fileKey
      const filename = fileKey.split('/').pop() || fileKey;

      return {
        content,
        filename,
        contentType:
          data.ContentType || this.getContentTypeByExtension(filename),
      };
    } catch (error) {
      if (error.$metadata?.httpStatusCode === 404) {
        throw new NotFoundException(`File not found: ${fileKey}`);
      }
      throw error;
    }
  }

  /**
   * Deletes a single file from the S3 bucket.
   *
   * @param fileKey - The S3 key of the file to delete.
   * @throws {Error} If deletion fails.
   */
  async deleteFile(fileKey: string): Promise<void> {
    const deleteParams = {
      Bucket: this.bucketName,
      Key: fileKey,
    };

    try {
      // Delete the file from S3.
      const command = new DeleteObjectCommand(deleteParams);
      await this.s3Client.send(command);
    } catch (error) {
      // Even if the file doesn't exist, we consider delete successful
      if (error.$metadata?.httpStatusCode !== 404) {
        throw new Error(`Failed to delete file: ${error.message}`);
      }
    }
  }

  /**
   * Determines content type based on file extension
   * @private
   */
  private getContentTypeByExtension(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const contentTypes = {
      pdf: 'application/pdf',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      webp: 'image/webp',
      // Add more as needed
    };

    return (
      contentTypes[ext as keyof typeof contentTypes] ||
      'application/octet-stream'
    );
  }
}
