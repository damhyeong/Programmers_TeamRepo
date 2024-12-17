import { ApiProperty } from "@nestjs/swagger";

export class ResponsePayloadDto {
  @ApiProperty({
    examples : [1, 2, 3, 15],
    description : "user 테이블의 PK id"
  })
  sub : number;

  @ApiProperty({
    examples : ["완두콩폭주족", "코딩러", "나다임마"],
    description : "유저가 가입 할 때 지정했던 닉네임이자, 유저네임"
  })
  username : string;

  @ApiProperty({
    examples : ["test@gmail.com"],
    description : "이메일"
  })
  email : string;

  @ApiProperty({
    examples : ["1734365048"],
    description : "JWT 발급 시점"
  })
  iat : number;

  @ApiProperty({
    examples : ["1734368648"],
    description : "JWT 만료 시점"
  })
  exp : number;
}