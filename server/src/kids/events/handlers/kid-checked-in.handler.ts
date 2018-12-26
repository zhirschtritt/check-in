import * as clc from 'cli-color';
import {IEventHandler, EventsHandler} from '@nestjs/cqrs';
import {KidCheckedInEvent} from '../impl/kid-checked-in.event';
import {Repository} from 'typeorm';
import {EventEntity} from '../event.entity';
import {validate} from 'class-validator';
import {InjectRepository} from '@nestjs/typeorm';

@EventsHandler(KidCheckedInEvent)
export class KidCheckedInHandler implements IEventHandler<KidCheckedInEvent> {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}
  async handle(event: KidCheckedInEvent) {
    const newCheckInEvent = new EventEntity();

    newCheckInEvent.name = 'check-in';
    newCheckInEvent.data = event;

    const errors = await validate(newCheckInEvent);

    if (errors.length > 0) {
      const _errors = 'Event is not valid.';
      throw new Error(_errors);
    } else {
      this.eventRepository.save(newCheckInEvent);
      console.log(clc.greenBright('KidCheckedInEvent handled...')); // tslint:disable-line
    }
  }
}
