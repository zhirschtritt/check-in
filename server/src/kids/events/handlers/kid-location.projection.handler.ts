import {Inject} from '@nestjs/common';
import {IEventHandler, EventsHandler} from '@nestjs/cqrs';
import {KidCheckedInEvent} from '../impl/kid-checked-in.event';
import {KidLocationProjection} from '../../projections/kid-location.projection';
import {KidLocation} from '@core';
import {di_keys} from '../../../common/di-keys';
import {KidCheckedOutEvent} from '../impl/kid-checked-out.event';

@EventsHandler(KidCheckedInEvent, KidCheckedOutEvent)
export class KidLocationProjectionEventHandler
  implements IEventHandler<KidCheckedInEvent | KidCheckedOutEvent> {
  constructor(
    @Inject(di_keys.KidLocationsProj)
    private readonly kidLocationsProj: KidLocationProjection,
  ) {}

  async handle(event: KidCheckedInEvent | KidCheckedOutEvent) {
    if (event instanceof KidCheckedInEvent) {
      const newKidLocation: KidLocation = {
        kidId: event.kidId,
        locationId: event.locationId,
        revision: 0,
      };

      return await this.kidLocationsProj.upsert(newKidLocation);
    }

    if (event instanceof KidCheckedOutEvent) {
      return await this.kidLocationsProj.delete(event.kidId);
    }

    throw new Error('Cannot handle unknown event type');
  }
}
