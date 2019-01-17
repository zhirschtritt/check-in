import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  Inject,
} from '@nestjs/common';
import {CheckInKidDto, CreateKidDto} from './dto';
import {KidsService} from './kids.service';
import {KidRO} from './interfaces/kid.interface';
import {KidLocation} from './interfaces/kid-projections.interface';
import {KidsCqrsService} from './kids-cqrs.service';

@Controller('kids')
export class KidsController {
  constructor(
    private readonly kidsCqrsService: KidsCqrsService,
    private readonly kidsService: KidsService,
  ) {}

  @Post(':id/checkIn')
  async checkIn(@Param('id') id: string, @Body() dto: CheckInKidDto) {
    await this.kidsCqrsService.checkIn(id, dto);
  }

  @Post(':id/checkOut')
  async checkOut(@Param('id') id: string): Promise<any> {
    return await this.kidsCqrsService.checkOut(id);
  }

  @Get(':id/location')
  getCurrentLocation(@Param('id') id: string): Promise<KidLocation> {
    return this.kidsCqrsService.getCurrentLocation(id);
  }

  @Get()
  findAll(): Promise<KidRO[]> {
    return this.kidsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<KidRO> {
    return this.kidsService.findOne(id);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() kidData: CreateKidDto): Promise<KidRO> {
    return this.kidsService.create(kidData);
  }
}
