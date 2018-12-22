import { AggregateRoot } from '@nestjs/cqrs';
import { KidCheckedInEvent } from '../events/impl/kid-checked-in.event';

export class Kid extends AggregateRoot {
  constructor(private readonly id: string) {
    super();
  }

  checkIn(locationId: string) {
    // if kid can check into location, create new kidCheckedInEvent
    this.apply(new KidCheckedInEvent(this.id, locationId));
  }
}