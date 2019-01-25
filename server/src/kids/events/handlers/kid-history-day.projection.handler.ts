import {Inject} from '@nestjs/common';
import {IEventHandler, EventsHandler} from '@nestjs/cqrs';
import {KidCheckedInEvent} from '../impl/kid-checked-in.event';
import {di_keys} from '../../../common/di-keys';
import {KidCheckedOutEvent} from '../impl/kid-checked-out.event';
import {KidHistoryDayProjection} from '../../projections';
import {EventType} from '../../interfaces/kid-event.interface';

@EventsHandler(KidCheckedInEvent, KidCheckedOutEvent)
export class KidHistoryDayProjectionEventHandler
  implements IEventHandler<KidCheckedInEvent | KidCheckedOutEvent> {
  constructor(
    @Inject(di_keys.KidHistoryDayProj)
    private readonly kidHistoryDayProj: KidHistoryDayProjection,
  ) {}

  async handle(event: KidCheckedInEvent | KidCheckedOutEvent) {
    if (event instanceof KidCheckedInEvent) {
      const newKidHistoryEvent = {
        eventType: EventType.kidCheckedInEvent,
        locationId: event.locationId,
      };

      return await this.kidHistoryDayProj.appendEvent(
        event.kidId,
        newKidHistoryEvent,
      );
    }

    if (event instanceof KidCheckedOutEvent) {
      const newKidHistoryEvent = {
        eventType: EventType.kidCheckedOutEvent,
      };

      return await this.kidHistoryDayProj.appendEvent(
        event.kidId,
        newKidHistoryEvent,
      );
    }

    throw new Error('Cannot handle unknown event type');
  }
}
