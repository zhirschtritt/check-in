import {IEvent} from '@nestjs/cqrs';
import {KidCheckedInEvent} from './impl/kid-checked-in.event';
import {Injectable} from '@nestjs/common';
import {KidCheckedOutEvent} from './impl/kid-checked-out.event';
import {EventType} from '@core';

export interface EventFactory {
  manufacture(eventType: EventType, data: any): IEvent;
}

@Injectable()
export class KidEventFactory implements EventFactory {
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
