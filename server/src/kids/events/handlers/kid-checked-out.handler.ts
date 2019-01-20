import {Inject} from '@nestjs/common';
import {IEventHandler, EventsHandler} from '@nestjs/cqrs';
import {KidLocationProjection} from '../../projections/kid-location.projection';
import {KidCheckedOutEvent} from '../impl/kid-checked-out.event';
import {AppLogger, LogFactory} from 'src/common/logger';

@EventsHandler(KidCheckedOutEvent)
export class KidCheckedOutHandler implements IEventHandler<KidCheckedOutEvent> {
  private readonly logger: AppLogger;

  constructor(
    @Inject('LogFactory') logFactory: LogFactory,
    @Inject('KidLocations')
    private readonly kidLocationsProj: KidLocationProjection,
  ) {
    this.logger = logFactory('KidCheckedOutHandler');
  }

  async handle(event: KidCheckedOutEvent) {
    try {
      await this.kidLocationsProj.delete(event.kidId);
    } catch (err) {
      this.logger.error({err}, 'Error updating projection');
      throw new Error('Error updating projection');
    }
  }
}
