import { IsOptional, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindManyPostDTO {
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  @IsNumber()
  meeting_id?: number;
}
