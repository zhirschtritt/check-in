import Dexie from 'dexie';
import {Inject} from '@nestjs/common';
import {IEventHandler, EventsHandler} from '@nestjs/cqrs';
import {KidCheckedInEvent} from '../impl/kid-checked-in.event';
import {KidLocation} from '../../projections/in-memory-db';

@EventsHandler(KidCheckedInEvent)
export class KidCheckedInHandler implements IEventHandler<KidCheckedInEvent> {
  constructor(
    @Inject('kidLocations')
    private readonly kidLocationsProjection: Dexie.Table<KidLocation, number>,
    @Inject('inMemoryDb')
    private readonly db: Dexie,
  ) {}

  async handle(event: KidCheckedInEvent) {
    // tslint:disable-next-line:no-console
    console.log(`Handling event check-in: ${JSON.stringify(event, null, 2)}`);

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

        // tslint:disable-next-line:no-console
        console.log(
          'Updating kidLocation aggregate: ',
          `${JSON.stringify(updatedKidLocations, null, 2)}`,
        );
      })
      .catch(err => {
        // tslint:disable-next-line:no-console
        console.error(err, 'Error updating projection');
        throw new Error('Error updating projection');
      });
  }
}
