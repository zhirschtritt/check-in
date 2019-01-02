import {
  EventPublisher,
  ICommandHandler,
  CommandHandler,
  IEvent,
} from '@nestjs/cqrs';
import {CheckInCommand} from '../impl/check-in.command';
import {KidAggreagateRoot} from '../../models/kid.model';
import {KidEvent, EventType} from 'src/kids/events/event.entity';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';

@CommandHandler(CheckInCommand)
export class CheckInHandler implements ICommandHandler<CheckInCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    @InjectRepository(KidEvent)
    private readonly eventRepository: Repository<KidEvent>,
  ) {}

  async execute(command: CheckInCommand, resolve: (value?) => void) {
    // tslint:disable-next-line:no-console
    console.log(
      `Handling check-in command: ${JSON.stringify(command, null, 2)}`,
    );
    const {kidId, locationId} = command;
    const kid = this.publisher.mergeObjectContext(new KidAggreagateRoot());

    const event = kid.checkIn(kidId, locationId);
    kid.commit(); // dispatch event

    await this.saveEvent(event); // save event to db

    resolve();
  }

  async saveEvent(event: IEvent) {
    const checkInEvent = new KidEvent();

    checkInEvent.type = 'CHECK_IN';
    checkInEvent.data = event;

    return this.eventRepository.save(checkInEvent);
  }
}
