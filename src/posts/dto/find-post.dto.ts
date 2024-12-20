import { IsOptional, IsNumber, IsNotEmpty } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class FindManyPostDTO {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  meeting_id: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  page: number;
}
