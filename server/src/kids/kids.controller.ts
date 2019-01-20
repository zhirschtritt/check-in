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
import {KidRO} from './interfaces/kid.interface';
import {KidLocation} from './projections/kid-location.projection';
import {KidsCqrsService} from './kids-cqrs.service';

@Controller('kids')
export class KidsController {
  constructor(
    private readonly kidsCqrsService: KidsCqrsService,
    private readonly kidsService: KidsService,
  ) {}

  @Post(':id/checkIn')
  checkIn(@Param('id') id: string, @Body() dto: CheckInKidDto) {
    return this.kidsCqrsService.checkIn(id, dto);
  }

  @Post(':id/checkOut')
  checkOut(@Param('id') id: string): Promise<any> {
    return this.kidsCqrsService.checkOut(id);
  }

  @Get('kidLocations')
  currentKidLocations(): Promise<KidLocation[]> {
    return this.kidsCqrsService.kidLocationsFindAll();
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
  create(@Body() kidData: CreateKidDto): Promise<KidRO> {
    return this.kidsService.create(kidData);
  }
}
