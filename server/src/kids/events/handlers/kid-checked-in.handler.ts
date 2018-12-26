import * as clc from 'cli-color';
import {IEventHandler, EventsHandler} from '@nestjs/cqrs';
import {KidCheckedInEvent} from '../impl/kid-checked-in.event';
import {Repository} from 'typeorm';
import {Event, EventType} from '../event.entity';
import {validate} from 'class-validator';
import {InjectRepository} from '@nestjs/typeorm';

@EventsHandler(KidCheckedInEvent)
export class KidCheckedInHandler implements IEventHandler<KidCheckedInEvent> {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}
  async handle(event: KidCheckedInEvent) {
    const newCheckIn = new Event();

    newCheckIn.event_type = EventType.checkIn;
    newCheckIn.data = event;

    const errors = await validate(newCheckIn);

    if (errors.length > 0) {
      const _errors = 'Event is not valid.';
      throw new Error(_errors);
    } else {
      this.eventRepository.save(newCheckIn);
      console.log(clc.greenBright('KidCheckedInEvent handled...')); // tslint:disable-line
    }
  }
}
