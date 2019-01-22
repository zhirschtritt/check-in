import {Inject} from '@nestjs/common';
import {IEventHandler, EventsHandler} from '@nestjs/cqrs';
import {KidCheckedInEvent} from '../impl/kid-checked-in.event';
import {
  KidLocation,
  KidLocationProjection,
} from '../../projections/kid-location.projection';
import {AppLogger, LogFactory} from '../../../common/logger';
import {
  KidHistoryDayProjection,
  KidHistoryEvent,
} from '../../projections/kid-history-day.projection';
import {EventType} from '../../interfaces/kid-event.interface';
import {di_keys} from '../../../common/di-keys';

@EventsHandler(KidCheckedInEvent)
export class KidCheckedInHandler implements IEventHandler<KidCheckedInEvent> {
  private readonly logger: AppLogger;

  constructor(
    @Inject(di_keys.LogFactory) logFactory: LogFactory,
    @Inject(di_keys.KidLocationsProj)
    private readonly kidLocationsProj: KidLocationProjection,
    @Inject(di_keys.KidHistoryDayProj)
    private readonly kidHistoryDayProj: KidHistoryDayProjection,
  ) {
    this.logger = logFactory('KidCheckedInHandler');
  }

  async handle(event: KidCheckedInEvent) {
    const newKidLocation: KidLocation = {
      kidId: event.kidId,
      locationId: event.locationId,
      revision: 0,
    };

    const newKidHistoryEvent: KidHistoryEvent = {
      eventType: EventType.kidCheckedInEvent,
      locationId: event.locationId,
    };

    try {
      await Promise.all([
        this.kidLocationsProj.upsert(newKidLocation),
        this.kidHistoryDayProj.appendEvent(event.kidId, newKidHistoryEvent),
      ]);
    } catch (err) {
      this.logger.error({err}, 'Error updating projection');
      throw new Error('Error updating projection');
    }
  }
}
