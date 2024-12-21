import { Injectable } from '@nestjs/common';
import {S3Client} from "@aws-sdk/client-s3/dist-types/S3Client";
import {Express} from "express";

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

  }
}
