import {
  IsDateString,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email 형식을 갖춰야 합니다',
    example: 'test@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'nickname, 즉 사용자가 사이트에서 원하는 이름',
    example: '담순쨩',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Gender - 성별',
    examples: ['female', 'male'],
  })
  gender: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'DateString - 생일 년, 월, 일 ',
    examples: ['2024-10-10', '2020-05-20'],
  })
  birth_date: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Password',
    example: 'password1234',
  })
  password: string;

  // 추후 @IsURL() 로 바꿀 예정 - 프로필 사진이 없을 수도 있다.
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '이미지 경로. 그러나, 프로필이 없을 경우, /images/default ',
    examples: ['/images/dogs/10', '/images/default'],
  })
  profile_img: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      "자기소개 문구. 자기소개 없을 경우, '아직 자기소개 문구가 없습니다.' 전송",
    examples: [
      '안녕하세요, 항상 공부중인 xxx 입니다.',
      '아직 자기소개 문구가 없습니다.',
    ],
  })
  introduction: string;
}
