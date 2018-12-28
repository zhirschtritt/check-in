import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {CheckInKidDto, CreateKidDto} from './dto';
import {KidsService} from './kids.service';
import {KidRO, KidLocationRO} from './interfaces/kid.interface';

@Controller('kids')
export class KidsController {
  constructor(private readonly kidsService: KidsService) {}

  @Post(':id/checkIn')
  async checkIn(@Param('id') id: string, @Body() dto: CheckInKidDto) {
    await this.kidsService.checkIn(id, dto);
  }

  @Get()
  findAll(): Promise<KidRO[]> {
    return this.kidsService.findAll();
  }

  @Get('kid/:id')
  findOne(@Param('id') id: string): Promise<KidRO> {
    return this.kidsService.findOne(id);
  }

  @Get('kid/:id/location')
  getCurrentLocation(@Param('id') id: string): Promise<KidLocationRO> {
    return this.kidsService.getCurrentLocation(id);
  }

  @UsePipes(new ValidationPipe())
  @Post('kid')
  async create(@Body() kidData: CreateKidDto): Promise<KidRO> {
    return this.kidsService.create(kidData);
  }
}
