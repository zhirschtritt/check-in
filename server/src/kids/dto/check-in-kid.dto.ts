import { IsNotEmpty } from 'class-validator';

export class CheckInKidDto {

  @IsNotEmpty()
  readonly locationId: string;
}