import {IsNotEmpty} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class CheckInKidDto {
  @ApiModelProperty({required: true})
  @IsNotEmpty()
  readonly locationId: string;
}
