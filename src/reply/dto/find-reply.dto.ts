import { IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class FindManyReplyDTO {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  page: number;
}
