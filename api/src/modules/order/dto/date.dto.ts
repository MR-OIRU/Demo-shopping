import { IsString } from 'class-validator';

export class OrderDate {
  @IsString()
  start: string;

  @IsString()
  end: string;
}
