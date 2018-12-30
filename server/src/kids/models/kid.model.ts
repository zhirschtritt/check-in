import {AggregateRoot} from '@nestjs/cqrs';
import {KidCheckedInEvent} from '../events/impl/kid-checked-in.event';

export class KidAggreagateRoot extends AggregateRoot {
  constructor() {
    super();
  }

  checkIn(kidId: string, locationId: string) {
    // if kid can check into location, create new kidCheckedInEvent
    this.apply(new KidCheckedInEvent(kidId, locationId));
  }
}
