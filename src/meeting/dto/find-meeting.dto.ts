import { IsOptional, IsNumber, IsNotEmpty } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class FindManyMeetingDTO {
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  @IsNumber()
  topic_id?: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  page: number;
}
