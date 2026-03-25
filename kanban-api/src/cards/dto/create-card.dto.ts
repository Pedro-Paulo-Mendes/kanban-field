import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  columnId: number;
}
