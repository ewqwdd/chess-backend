import { IsNumber } from 'class-validator';

export class completePuzzleDto {
  @IsNumber()
  time: number;
}
