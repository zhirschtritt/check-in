import {Inject} from '@nestjs/common';
import {IEventHandler, EventsHandler} from '@nestjs/cqrs';
import {KidCheckedInEvent} from '../impl/kid-checked-in.event';
import {
  KidLocation,
  KidLocationProjection,
} from '../../projections/kid-location.projection';
import {AppLogger, LogFactory} from '../../../common/logger';

@EventsHandler(KidCheckedInEvent)
export class KidCheckedInHandler implements IEventHandler<KidCheckedInEvent> {
  private readonly logger: AppLogger;

  constructor(
    @Inject('LogFactory') logFactory: LogFactory,
    @Inject('KidLocations')
    private readonly kidLocationsProj: KidLocationProjection,
  ) {
    this.logger = logFactory('KidCheckedInHandler');
  }

  async handle(event: KidCheckedInEvent) {
    const newKidLocation: KidLocation = {
      kidId: event.kidId,
      locationId: event.locationId,
      revision: 0,
    };

    try {
      await this.kidLocationsProj.upsert(newKidLocation);
    } catch (err) {
      this.logger.error({err}, 'Error updating projection');
      throw new Error('Error updating projection');
    }
  }
}
