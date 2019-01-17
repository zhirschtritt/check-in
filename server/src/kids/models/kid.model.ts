import {AggregateRoot, IEvent} from '@nestjs/cqrs';
import {InjectRepository} from '@nestjs/typeorm';
import {Injectable, Inject} from '@nestjs/common';
import {Repository} from 'typeorm';
import {KidEvent} from '../events/kid-event.entity';
import {EventFactory} from '../events/kid-event.factory';
import {KidCheckedInEvent} from '../events/impl/kid-checked-in.event';
import {KidCheckedOutEvent} from '../events/impl/kid-checked-out.event';
import {InMemoryDb} from '../projections/in-memory-db';
import {EventType} from '../interfaces/kid-event.interface';

export interface KidAggregateRoot extends AggregateRoot {
  checkIn(kidId: string, locationId: string): Promise<IEvent>;
  checkOut(kidId: string): Promise<IEvent>;
  loadFromHistory(rawHistory: KidEvent[]): void;
}

@Injectable()
export class KidAggregateRootImpl extends AggregateRoot
  implements KidAggregateRoot {
  constructor(
    @Inject('EventFactory')
    private readonly kidEventFactory: EventFactory,
    @Inject('InMemoryDb')
    private readonly projectionsDb: InMemoryDb,
    @InjectRepository(KidEvent)
    private readonly eventRepository: Repository<KidEvent>,
  ) {
    super();
    this.autoCommit = true;
  }

  async checkIn(kidId: string, locationId: string): Promise<IEvent> {
    const checkInEvent = new KidCheckedInEvent({kidId, locationId});
    const kidEvent = await this.saveEvent(
      checkInEvent,
      EventType.kidCheckedInEvent,
    );

    this.apply(checkInEvent);

    return kidEvent;
  }

  async checkOut(kidId: string): Promise<IEvent> {
    const kidLocation = await this.projectionsDb.kidLocations
      .where('kidId')
      .equals(kidId)
      .first();

    if (kidLocation && kidLocation.locationId) {
      const checkOutEvent = new KidCheckedOutEvent({kidId});
      const kidEvent = await this.saveEvent(
        checkOutEvent,
        EventType.kidCheckedOutEvent,
      );

      this.apply(checkOutEvent);

      return kidEvent;
    }

    throw new Error('Kid not currently checked in, cannot check out');
  }

  loadFromHistory(rawHistory: KidEvent[]) {
    rawHistory
      .map(event => this.kidEventFactory.manufacture(event.type, event.data))
      .forEach(kidEvent => this.apply(kidEvent));
  }

  async saveEvent(event: IEvent, eventType: EventType) {
    const newKidEvent = new KidEvent();

    newKidEvent.type = eventType;
    newKidEvent.data = event;

    return this.eventRepository.save(newKidEvent);
  }
}
