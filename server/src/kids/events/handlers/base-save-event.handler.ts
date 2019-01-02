import {IEventHandler, EventsHandler, IEvent} from '@nestjs/cqrs';
import {KidCheckedInEvent} from '../impl/kid-checked-in.event';
import {Repository} from 'typeorm';
import {KidEvent, EventType} from '../event.entity';
import {validate} from 'class-validator';
import {InjectRepository} from '@nestjs/typeorm';

export class BaseSaveKidEventHandler
  implements IEventHandler<KidCheckedInEvent> {
  constructor(
    @InjectRepository(KidEvent)
    private readonly eventRepository: Repository<KidEvent>,
  ) {}

  async handle(event: KidCheckedInEvent) {
    // tslint:disable-next-line:no-console
    console.log('saving event');
    await this.saveEvent(event, 'CHECK_IN');
  }

  private async saveEvent(event: IEvent, eventType: EventType) {
    const newCheckIn = new KidEvent();

    newCheckIn.type = eventType;
    newCheckIn.data = event;

    const errors = await validate(newCheckIn);
    if (errors.length > 0) {
      throw new Error(errors.join(', \n'));
    } else {
      this.eventRepository.save(newCheckIn);
    }
  }
}
