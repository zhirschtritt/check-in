import {AggregateRoot, IEvent} from '@nestjs/cqrs';
import {KidEvent} from '../events/kid-event.entity';
import {KidEventFactory} from '../events/kid-event.factory';
import {Injectable} from '@nestjs/common';
import {EventType} from '../interfaces/kid-event.interface';

@Injectable()
export class KidAggregateRoot extends AggregateRoot {
  constructor(private readonly kidEventFactory: KidEventFactory) {
    super();
  }

  checkIn(kidId: string, locationId: string): IEvent {
    // if kid can check into location, create new kidCheckedInEvent
    const checkInEvent = this.kidEventFactory.manufacture(
      EventType.kidCheckedInEvent,
      {kidId, locationId},
    );

    this.apply(checkInEvent);

    return checkInEvent;
  }

  loadFromHistory(rawHistory: KidEvent[]) {
    rawHistory
      .map(event => this.kidEventFactory.manufacture(event.type, event.data)) // TODO: inject KidEventFactory
      .forEach(kidEvent => {
        this.apply(kidEvent);
        this.commit();
      });
  }
}
