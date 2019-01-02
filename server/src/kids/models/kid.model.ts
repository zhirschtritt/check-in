import {AggregateRoot, IEvent} from '@nestjs/cqrs';
import {KidCheckedInEvent} from '../events/impl/kid-checked-in.event';
import {KidEvent} from '../events/event.entity';

export class KidAggreagateRoot extends AggregateRoot {
  constructor() {
    super();
  }

  checkIn(kidId: string, locationId: string): IEvent {
    // if kid can check into location, create new kidCheckedInEvent
    const checkInEvent = new KidCheckedInEvent(kidId, locationId);

    this.apply(checkInEvent);

    return checkInEvent;
  }

  loadFromHistory(rawHistory: KidEvent[]) {
    rawHistory
      .map(event => event.data as {kidId: string; locationId: string})
      .map(event => new KidCheckedInEvent(event.kidId, event.locationId))
      .forEach(event => {
        this.apply(event);
        this.commit();
      });
  }
}
