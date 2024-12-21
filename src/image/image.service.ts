import { Injectable } from '@nestjs/common';
import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
import {v4 as uuid} from "uuid";

@Injectable()
export class ImageService {
  // 현재 이미지 저장, 혹은 업로드 해야 하는 버킷의 이름
  private bucketName : string = process.env.AWS_BUCKET_NAME;

  // 버킷에 접근하기 위해서는 만들어둔 IAM 접근 키, 비밀 접근 키가 필요할 뿐만 아니라,
  // 해당 버킷의 지역도 정보로서 들어가야 한다.
  private s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  // 파일을 백엔드 상에서 업로드 하기 위해서는, Express.Multer.File 타입으로 받는다. - 이는 바이너리 "버퍼" 이다.
  async uploadImageToS3(file : Express.Multer.File) {
    // 서버에 내장된 uuid 도 중복 불가능한 숫자를 생성하고, 그 이후 파일의 이름을 덧붙인다.
    const key = `images/${uuid()}-${file.originalname}`;

    // s3 bucket 에 보낼 명령 오브젝트를 작성하는 것이다.
    // 저장할 버킷의 이름, 버킷 URL 이후에 저장될 url 명시(key), Body 는 바이너리 파일 버퍼를 입력한다.
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    // 현재 s3 객체는 직접 생성한 S3 IAM 권한으로 연결이 생성된 상태이다.
    // 위의 명령어 옵션 집합을 사용하여, 파일이 저장되기까지 기다린다.
    await this.s3.send(command);

    // 파일이 저장된 이미지의 경로를 반환한다.
    return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }
}
