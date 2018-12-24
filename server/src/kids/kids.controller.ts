import { Controller, Post, Get, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { CheckInKidDto, CreateKidDto } from './dto';
import { KidsService } from './kids.service';
import { Kid } from './kid.entity';

@Controller('kids')
export class KidsController {
  constructor(private readonly kidsService: KidsService) {}

  @Post(':id/checkIn')
  async checkIn(@Param('id') id: string, @Body() dto: CheckInKidDto) {
    await this.kidsService.checkIn(id, dto);
  }

  @Get()
  findAll(): Promise<Kid[]> {
    return this.kidsService.findAll();
  }

  @UsePipes(new ValidationPipe())
  @Post('kid')
  async create(@Body('user') kidData: CreateKidDto) {
    return this.kidsService.create(kidData);
  }
}