import { IsOptional, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindManyMeetingDTO {
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  @IsNumber()
  topic_id?: number;
}
