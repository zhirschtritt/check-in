import {IsNotEmpty} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class CreateKidDto {
  @ApiModelProperty({required: true})
  @IsNotEmpty()
  readonly firstName: string;

  @ApiModelProperty({required: true})
  @IsNotEmpty()
  readonly lastName: string;

  @ApiModelProperty({required: true, type: 'string'})
  @IsNotEmpty()
  readonly dob: Date;
}
