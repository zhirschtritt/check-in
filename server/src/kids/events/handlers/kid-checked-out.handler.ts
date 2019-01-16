import Dexie from 'dexie';
import {Inject} from '@nestjs/common';
import {IEventHandler, EventsHandler} from '@nestjs/cqrs';
import {KidLocation} from '../../interfaces/kid-projections.interface';
import {KidCheckedOutEvent} from '../impl/kid-checked-out.event';
import {AppLogger, LoggerFactory} from 'src/common/logger';

@EventsHandler(KidCheckedOutEvent)
export class KidCheckedOutHandler implements IEventHandler<KidCheckedOutEvent> {
  private readonly logger: AppLogger;
  constructor(
    @Inject('kidLocations')
    private readonly kidLocationsProjection: Dexie.Table<KidLocation, number>,
    @Inject('inMemoryDb')
    private readonly db: Dexie,
  ) {
    this.logger = LoggerFactory('KidCheckedOutHandler');
  }

  async handle(event: KidCheckedOutEvent) {
    this.logger.debug({event}, 'Handling event check-out');

    this.db
      .transaction('rw', this.kidLocationsProjection, async () => {
        const currentLocation = await this.kidLocationsProjection
          .where('kidId')
          .equals(event.kidId)
          .first();

        if (currentLocation && currentLocation.locationId) {
          this.kidLocationsProjection.update(currentLocation.id, {
            locationId: '',
            revision: currentLocation.revision += 1,
          });
        }

        const updatedKidLocations = await this.kidLocationsProjection.toArray();

        this.logger.debug(
          {updatedKidLocations},
          'Updating kidLocation aggregate',
        );
      })
      .catch(err => {
        this.logger.error({err}, 'Error updating projection');
        throw new Error('Error updating projection');
      });
  }
}
