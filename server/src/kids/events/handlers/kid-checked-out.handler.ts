import {Inject} from '@nestjs/common';
import {IEventHandler, EventsHandler} from '@nestjs/cqrs';
import {KidLocationProjection} from '../../projections/kid-location.projection';
import {KidCheckedOutEvent} from '../impl/kid-checked-out.event';
import {AppLogger, LogFactory} from 'src/common/logger';
import {KidHistoryDayProjection} from '../../projections/kid-history-day.projection';
import {EventType} from '../../interfaces/kid-event.interface';
import {di_keys} from '../../../common/di-keys';

@EventsHandler(KidCheckedOutEvent)
export class KidCheckedOutHandler implements IEventHandler<KidCheckedOutEvent> {
  private readonly logger: AppLogger;

  constructor(
    @Inject(di_keys.LogFactory) logFactory: LogFactory,
    @Inject(di_keys.KidLocationsProj)
    private readonly kidLocationsProj: KidLocationProjection,
    @Inject(di_keys.KidHistoryDayProj)
    private readonly kidHistoryDayProj: KidHistoryDayProjection,
  ) {
    this.logger = logFactory('KidCheckedOutHandler');
  }

  async handle(event: KidCheckedOutEvent) {
    try {
      await Promise.all([
        this.kidLocationsProj.delete(event.kidId),
        this.kidHistoryDayProj.appendEvent(event.kidId, {
          eventType: EventType.kidCheckedOutEvent,
        }),
      ]);
    } catch (err) {
      this.logger.error({err}, 'Error updating projection');
      throw new Error('Error updating projection');
    }
  }
}
