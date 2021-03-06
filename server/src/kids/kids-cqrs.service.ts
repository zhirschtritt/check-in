import {Injectable, Inject} from '@nestjs/common';
// import {Repository} from 'typeorm';
// import {InjectRepository} from '@nestjs/typeorm';
import {CommandBus} from '@nestjs/cqrs';
// import {KidEvent} from './events/kid-event.entity';
import {CheckInKidDto} from './dto';
import {CheckInCommand} from './commands/impl/check-in.command';
// import {LoadFromHistoryCommand} from './commands/impl/load-from-history.command';
import {CheckOutCommand} from './commands/impl/check-out.command';
import {di_keys} from '../common/di-keys';
import {KidLocation, KidHistoryDay} from '@core';
import {KidHistoryDayProjectionRepository} from './projections';
import {KidLocationProjectionRepository} from './projections/kid-location-projection-repository';

@Injectable()
export class KidsCqrsService {
  constructor(
    @Inject(di_keys.KidLocationsProj)
    private readonly kidLocationProj: KidLocationProjectionRepository,
    @Inject(di_keys.KidHistoryDayProj)
    private readonly kidHistoryDayProj: KidHistoryDayProjectionRepository,
    private readonly commandBus: CommandBus, // @InjectRepository(KidEvent) private readonly eventRepository: Repository<KidEvent>,
  ) {}

  async checkIn(kidId: string, checkInKidDto: CheckInKidDto) {
    const command = new CheckInCommand(kidId, checkInKidDto.locationId);

    return await this.commandBus.execute(command);
  }

  async checkOut(kidId: string) {
    const command = new CheckOutCommand(kidId);

    return await this.commandBus.execute(command);
  }

  async kidLocationsFindAll(): Promise<KidLocation[]> {
    return await this.kidLocationProj.findAll();
  }

  async kidDailyHistoriesFindAll(): Promise<KidHistoryDay[]> {
    return await this.kidHistoryDayProj.findAll();
  }

  async kidDailyHistoriesFindOne(id: string): Promise<KidHistoryDay> {
    return await this.kidHistoryDayProj.findOne(id);
  }

  // async loadEventsFromDay() {
  //   this.logger.debug({}, 'loading all events from day');

  //   const startOfDay = new Date();
  //   startOfDay.setHours(0, 0, 0, 0);

  //   const allEventsFromDay = await this.eventRepository
  //     .createQueryBuilder('kid_event')
  //     .where('kid_event.created_at > :startOfDay', {startOfDay})
  //     .getMany();

  //   const rawHistory = allEventsFromDay;
  //   const command = new LoadFromHistoryCommand(rawHistory);

  //   return this.commandBus.execute(command);
  // }
}
