import { Injectable } from '@nestjs/common';
import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
import {v4 as uuid} from "uuid";

@Injectable()
export class ImageService {

  private bucketName = process.env.AWS_BUCKET_NAME;

  private s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  async uploadImageToS3(file : Express.Multer.File) {
    const key = `images/${uuid()}-${file.originalname}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(command);

    return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }
}
