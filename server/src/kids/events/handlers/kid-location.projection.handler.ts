import {Inject} from '@nestjs/common';
import {IEventHandler, EventsHandler} from '@nestjs/cqrs';
import {KidCheckedInEvent} from '../impl/kid-checked-in.event';
import {KidLocation} from '@core';
import {di_keys} from '../../../common/di-keys';
import {KidCheckedOutEvent} from '../impl/kid-checked-out.event';
import {FirestoreRepository} from '../../../persistance/firestore-repository.factory';
import {KidLocationProjectionRepository} from '../../projections/kid-location-repository';

@EventsHandler(KidCheckedInEvent, KidCheckedOutEvent)
export class KidLocationProjectionEventHandler
  implements IEventHandler<KidCheckedInEvent | KidCheckedOutEvent> {
  constructor(
    @Inject(di_keys.KidLocationsProj)
    private readonly kidLocationsProjRepo: KidLocationProjectionRepository,
  ) {}

  async handle(event: KidCheckedInEvent | KidCheckedOutEvent) {
    if (event instanceof KidCheckedInEvent) {
      const newKidLocation: KidLocation = {
        kidId: event.kidId,
        locationId: event.locationId,
      };

      const existingLocRecord = await this.kidLocationsProjRepo.findByKidId(event.kidId);

      if (existingLocRecord) {
        return await this.kidLocationsProjRepo.update(existingLocRecord.id, newKidLocation);
      }

      return await this.kidLocationsProjRepo.create(newKidLocation);
    }

    if (event instanceof KidCheckedOutEvent) {
      return await this.kidLocationsProjRepo.delete(event.kidId);
    }

    throw new Error('Cannot handle unknown event type');
  }
}
