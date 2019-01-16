import {AggregateRoot, IEvent} from '@nestjs/cqrs';
import {InjectRepository} from '@nestjs/typeorm';
import {Injectable, Inject} from '@nestjs/common';
import {Repository} from 'typeorm';
import {KidEvent} from '../events/kid-event.entity';
import {KidEventFactory} from '../events/kid-event.factory';
import {KidCheckedInEvent} from '../events/impl/kid-checked-in.event';
import {KidCheckedOutEvent} from '../events/impl/kid-checked-out.event';
import {InMemoryDb} from '../projections/in-memory-db';
import {EventType} from '../interfaces/kid-event.interface';

@Injectable()
export class KidAggregateRoot extends AggregateRoot {
  constructor(
    private readonly kidEventFactory: KidEventFactory,
    @Inject('inMemoryDb')
    private readonly projectionsDb: InMemoryDb,
    @InjectRepository(KidEvent)
    private readonly eventRepository: Repository<KidEvent>,
  ) {
    super();
  }

  checkIn(kidId: string, locationId: string): IEvent {
    const checkInEvent = new KidCheckedInEvent({kidId, locationId});
    this.apply(checkInEvent);
    return checkInEvent;
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
      .forEach(kidEvent => {
        this.apply(kidEvent);
        this.commit();
      });
  }

  async saveEvent(event: IEvent, eventType: EventType) {
    const newKidEvent = new KidEvent();

    newKidEvent.type = eventType;
    newKidEvent.data = event;

    return this.eventRepository.save(newKidEvent);
  }
}
