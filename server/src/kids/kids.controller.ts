import { Controller, Post, Body, Param } from '@nestjs/common';
import { CheckInKidDto } from './interfaces/check-in-kid-dto.interface';
import { KidsService } from './kids.service';

@Controller('kids')
export class KidsController {
  constructor(private readonly kidsService: KidsService) {}

  @Post(':id/checkIn')
  async checkIn(@Param('id') id: string, @Body() dto: CheckInKidDto) {
    await this.kidsService.checkIn(id, dto);
  }
}