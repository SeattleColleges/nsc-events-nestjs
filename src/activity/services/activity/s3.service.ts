import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
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

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const uploadParams = {
      Bucket: this.bucketName,
      Key: `${folder}/${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(uploadParams);
    await this.s3Client.send(command);

    return `https://${this.bucketName}.s3.amazonaws.com/${uploadParams.Key}`;
  }
  async getFile(fileKey: string): Promise<Buffer> {
    const getParams = {
      Bucket: this.bucketName,
      Key: fileKey,
    };

    const command = new GetObjectCommand(getParams);
    const data = await this.s3Client.send(command);

    return data.Body as Buffer;
  }
  async deleteFile(fileKey: string): Promise<void> {
    const deleteParams = {
      Bucket: this.bucketName,
      Key: fileKey,
    };

    const command = new DeleteObjectCommand(deleteParams);
    await this.s3Client.send(command);
  }
  async listFiles(folder: string): Promise<string[]> {
    const listParams = {
      Bucket: this.bucketName,
      Prefix: folder,
    };

    const command = new ListObjectsV2Command(listParams);
    const data = await this.s3Client.send(command);

    return data.Contents?.map((item) => item.Key!) || [];
  }
  async deleteFiles(folder: string): Promise<void> {
    const files = await this.listFiles(folder);
    const deleteParams = {
      Bucket: this.bucketName,
      Delete: {
        Objects: files.map((file) => ({ Key: file })),
      },
    };

    const command = new DeleteObjectCommand(deleteParams);
    await this.s3Client.send(command);
  }
}
