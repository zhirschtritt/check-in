import {di_keys} from '../../../common/di-keys';
import {IEventHandler, EventsHandler} from '@nestjs/cqrs';
import {Inject} from '@nestjs/common';
import {KidCheckedInEvent} from '../impl/kid-checked-in.event';
import {KidCheckedOutEvent} from '../impl/kid-checked-out.event';
import {KidLocation} from '@core';
import {KidLocationProjectionRepository} from '../../projections/kid-location-projection-repository';

@EventsHandler(KidCheckedInEvent, KidCheckedOutEvent)
export class KidLocationProjectionEventHandler
  implements IEventHandler<KidCheckedInEvent | KidCheckedOutEvent> {
  constructor(
    @Inject(di_keys.KidLocationsProj)
    private readonly kidLocationsProjRepo: KidLocationProjectionRepository,
  ) {}

  async handle(event: KidCheckedInEvent | KidCheckedOutEvent) {
    const existingLocRecord = await this.kidLocationsProjRepo.findByKidId(event.kidId);

    if (event instanceof KidCheckedInEvent) {
      const newKidLocation: KidLocation = {
        kidId: event.kidId,
        locationId: event.locationId,
      };

      if (existingLocRecord) {
        return await this.kidLocationsProjRepo.update(existingLocRecord.id, newKidLocation);
      }

      return await this.kidLocationsProjRepo.create(newKidLocation);
    }

    if (event instanceof KidCheckedOutEvent && existingLocRecord) {
      return await this.kidLocationsProjRepo.delete(existingLocRecord.id);
    }

    throw new Error('Cannot handle unknown event type');
  }
}
