import {
  EventPublisher,
  ICommandHandler,
  CommandHandler,
  IEvent,
  AggregateRoot,
} from '@nestjs/cqrs';
import {CheckInCommand} from '../impl/check-in.command';
import {KidAggregateRoot} from '../../models/kid.model';
import {KidEvent} from 'src/kids/events/kid-event.entity';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {EventType} from 'src/kids/interfaces/kid-event.interface';
import {Inject} from '@nestjs/common';

@CommandHandler(CheckInCommand)
export class CheckInHandler implements ICommandHandler<CheckInCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    @InjectRepository(KidEvent)
    private readonly eventRepository: Repository<KidEvent>,
    @Inject('KidAggregateRoot')
    private readonly kidAggregateRoot: KidAggregateRoot,
  ) {}

  async execute(command: CheckInCommand, resolve: (value?) => void) {
    // tslint:disable-next-line:no-console
    console.log(
      `Handling check-in command: ${JSON.stringify(command, null, 2)}`,
    );
    const {kidId, locationId} = command;
    const kid = this.publisher.mergeObjectContext(this.kidAggregateRoot);

    const event = kid.checkIn(kidId, locationId);
    kid.commit(); // dispatch event

    await this.saveEvent(event); // save event to db

    resolve();
  }

  async saveEvent(event: IEvent) {
    const checkInEvent = new KidEvent();

    checkInEvent.type = EventType.kidCheckedInEvent;
    checkInEvent.data = event;

    return this.eventRepository.save(checkInEvent);
  }
}
