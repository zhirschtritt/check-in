import { IsNotEmpty } from 'class-validator';

export class CreateKidDto {

  @IsNotEmpty()
  readonly firstName: string;

  @IsNotEmpty()
  readonly lastName: string;

  @IsNotEmpty()
  readonly dob: Date;
}