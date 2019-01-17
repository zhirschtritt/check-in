import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {CommandBus} from '@nestjs/cqrs';
import {KidEvent} from './events/kid-event.entity';
import {CheckInKidDto} from './dto';
import {CheckInCommand} from './commands/impl/check-in.command';
import {LoadFromHistoryCommand} from './commands/impl/load-from-history.command';
import {CheckOutCommand} from './commands/impl/check-out.command';
import {AppLogger, LoggerFactory} from 'src/common/logger';
import {KidLocation} from './interfaces/kid-projections.interface';
import {InMemoryDb} from './projections/in-memory-db';

@Injectable()
export class KidsCqrsService {
  private readonly logger: AppLogger;
  constructor(
    private readonly inMemoryDb: InMemoryDb,
    @InjectRepository(KidEvent)
    private readonly eventRepository: Repository<KidEvent>,
    private readonly commandBus: CommandBus,
  ) {
    this.logger = LoggerFactory('KidsCqrsService');
  }

  async checkIn(kidId: string, checkInKidDto: CheckInKidDto) {
    const command = new CheckInCommand(kidId, checkInKidDto.locationId);

    return await this.commandBus.execute(command);
  }

  async checkOut(kidId: string) {
    const command = new CheckOutCommand(kidId);

    return await this.commandBus.execute(command);
  }

  async loadEventsFromDay() {
    this.logger.debug({}, 'loading all events from day');

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const allEventsFromDay = await this.eventRepository
      .createQueryBuilder('kid_event')
      .where('kid_event.created_at > :startOfDay', {startOfDay})
      .getMany();

    const rawHistory = allEventsFromDay;
    const command = new LoadFromHistoryCommand(rawHistory);

    return this.commandBus.execute(command);
  }

  async getCurrentLocation(kidId: string): Promise<KidLocation> {
    const kidLocation = await this.inMemoryDb.kidLocations
      .where('kidId')
      .equals(kidId)
      .first();

    return {
      kidId: kidLocation.kidId,
      locationId: kidLocation.locationId,
    };
  }
}
