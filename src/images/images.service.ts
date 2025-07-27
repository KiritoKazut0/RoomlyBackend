import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { uploadFileResponseDto } from './dto/response-upload.dto';
import { v4 as uuidv4 } from "uuid"


@Injectable()
export class ImagesService {
  private client: S3Client
  private bucketName = process.env["S3_BUCKET_NAME"]

  constructor() {

    const s3_region = process.env["S3_REGION"]
    const S3_access_key = process.env["S3_ACCESS_KEY"]
    const s3_secret_access_key = process.env["S3_SECRET_ACCESS_KEY"]
    const aws_secret_session_token = process.env["AWS_SECRET_SESSION_TOKEN"]

    if (!s3_region || !s3_secret_access_key || !S3_access_key || !aws_secret_session_token) {
      throw new Error("Missing one or more AWS environment variables")
    }

    this.client = new S3Client({
      region: s3_region,
      credentials: {
        accessKeyId: S3_access_key,
        secretAccessKey: s3_secret_access_key,
        sessionToken: aws_secret_session_token
      },
      forcePathStyle: true
    });
  }

  async uploadMultipleFiles({
    files,
    isPublic = true
  }: {
    files: Express.Multer.File[],
    isPublic: boolean
  }): Promise<uploadFileResponseDto[]> {

    const uploadedFiles: { key: string; isPublic: boolean }[] = [];

    try {

      const uploadResults: uploadFileResponseDto[] = [];

      for (const file of files) {

        const key = `${uuidv4()}`;
        const command = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: `rooms/${key}`,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: isPublic ? 'public-read' : 'private',
          Metadata: {
            originlName: file.originalname
          }
        });

        await this.client.send(command);

        const url = isPublic
          ? (await this.getFileUrl(key, 'rooms')).url
          : (await this.getPresignedSignedUrl(key, 'rooms')).url;

        uploadResults.push({ key, url, isPublic });
        uploadedFiles.push({ key, isPublic });
      }

      return uploadResults;

    } catch (error) {

      await Promise.all(uploadedFiles.map(({ key }) =>
        this.deleteFile(`rooms/${key}`).catch(() => null)
      ));

      throw new HttpException(
        "One or more files failed to upload. All uploads have been rolled back.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );

    }
  }


  async uploadFile({
    file, isPublic = true
  }: { file: Express.Multer.File, isPublic: boolean }): Promise<uploadFileResponseDto> {
    try {

      const key = `${uuidv4()}`
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: `profile_users/${key}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: isPublic ? 'public-read' : 'private',
        Metadata: {
          originlName: file.originalname
        }
      });

       await this.client.send(command)

      return {
        url: isPublic
          ? (await this.getFileUrl(key, 'profile_users')).url
          : (await this.getPresignedSignedUrl(key, 'profile_users')).url,
        key,
        isPublic
      }


    } catch (error) {
      throw new HttpException(
        "Failed to upload file to S3. Please try again later.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }


  async getPresignedSignedUrl(key: string, type: string): Promise<{ url: string }> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: `${type}/${key}`,
      });

      const url = await getSignedUrl(this.client, command, {
        expiresIn: 60 * 60 * 24,
      });

      return { url };

    } catch (error) {
      throw new HttpException(
        'Failed to generate signed URL for private file access.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }



  async getFileUrl(key: string, type: string): Promise<{ url: string }> {
    return { url: `https://${this.bucketName}.s3.amazonaws.com/${type}/${key}` };
  }


  async deleteFile(key: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.client.send(command);

      return { message: 'File deleted successfully' };

    } catch (error) {
      throw new HttpException(
        'Failed to delete file from S3.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }



}
