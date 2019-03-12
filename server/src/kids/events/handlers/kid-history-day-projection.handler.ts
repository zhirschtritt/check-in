import {Inject} from '@nestjs/common';
import {IEventHandler, EventsHandler} from '@nestjs/cqrs';
import {KidCheckedInEvent} from '../impl/kid-checked-in.event';
import {di_keys} from '../../../common/di-keys';
import {KidCheckedOutEvent} from '../impl/kid-checked-out.event';
import {EventType} from '@core';
import {KidHistoryDayProjectionRepository} from '../../projections';

@EventsHandler(KidCheckedInEvent, KidCheckedOutEvent)
export class KidHistoryDayProjectionEventHandler
  implements IEventHandler<KidCheckedInEvent | KidCheckedOutEvent> {
  constructor(
    @Inject(di_keys.KidHistoryDayProj)
    private readonly kidHistoryDayProj: KidHistoryDayProjectionRepository,
  ) {}

  async handle(event: KidCheckedInEvent | KidCheckedOutEvent) {
    if (event instanceof KidCheckedInEvent) {
      const newKidHistoryEvent = {
        eventType: EventType.kidCheckedInEvent,
        locationId: event.locationId,
      };

      return await this.kidHistoryDayProj.appendEventByKidId(event.kidId, newKidHistoryEvent);
    }

    if (event instanceof KidCheckedOutEvent) {
      const newKidHistoryEvent = {
        eventType: EventType.kidCheckedOutEvent,
      };

      return await this.kidHistoryDayProj.appendEventByKidId(event.kidId, newKidHistoryEvent);
    }
    // TODO: use typescript 'never' to confirm this doesn't throw
    throw new Error('Cannot handle unknown event type');
  }
}
