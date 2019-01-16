import {IEvent} from '@nestjs/cqrs';
import {EventType} from '../interfaces/kid-event.interface';
import {KidCheckedInEvent} from './impl/kid-checked-in.event';
import {Injectable} from '@nestjs/common';
import {KidCheckedOutEvent} from './impl/kid-checked-out.event';

@Injectable()
export class KidEventFactory {
  manufacture(eventType: EventType, data: any): IEvent {
    // TODO: define interface eventData
    switch (eventType) {
      case EventType.kidCheckedInEvent:
        return new KidCheckedInEvent(data);
      case EventType.kidCheckedOutEvent:
        return new KidCheckedOutEvent(data);
      default:
        throw new Error('No matching event for event type');
    }
  }
}
