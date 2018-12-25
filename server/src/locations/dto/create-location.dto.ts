import {IsNotEmpty} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiModelProperty({required: true})
  @IsNotEmpty()
  readonly name: string;
}
