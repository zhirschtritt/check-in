import Dexie from 'dexie';
import {Inject} from '@nestjs/common';
import {IEventHandler, EventsHandler} from '@nestjs/cqrs';
import {KidCheckedInEvent} from '../impl/kid-checked-in.event';
import {KidLocation} from '../../interfaces/kid-projections.interface';
import {AppLogger, LoggerFactory} from 'src/common/logger';
import {InMemoryDb} from 'src/kids/projections/in-memory-db';

@EventsHandler(KidCheckedInEvent)
export class KidCheckedInHandler implements IEventHandler<KidCheckedInEvent> {
  private readonly logger: AppLogger;
  private readonly kidLocationsProjection: Dexie.Table<KidLocation, number>;

  constructor(private readonly db: InMemoryDb) {
    this.logger = LoggerFactory('KidCheckedInHandler');
    this.kidLocationsProjection = db.kidLocations;
  }

  async handle(event: KidCheckedInEvent) {
    this.logger.debug({event}, 'Handling event check-in');

    const newKidLocation: KidLocation = {
      kidId: event.kidId,
      locationId: event.locationId,
      revision: 0,
    };

    this.db
      .transaction('rw', this.kidLocationsProjection, async () => {
        const currentLocation = await this.kidLocationsProjection
          .where('kidId')
          .equals(newKidLocation.kidId)
          .first();

        if (currentLocation) {
          this.kidLocationsProjection.update(currentLocation.id, {
            locationId: newKidLocation.locationId,
            revision: currentLocation.revision += 1,
          });
        } else {
          this.kidLocationsProjection.add(newKidLocation);
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
