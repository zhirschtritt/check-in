import {di_keys} from '../../../common/di-keys';
import {IEventHandler, EventsHandler} from '@nestjs/cqrs';
import {Inject} from '@nestjs/common';
import {KidCheckedInEvent} from '../impl/kid-checked-in.event';
import {KidCheckedOutEvent} from '../impl/kid-checked-out.event';
import {KidsByLocationProjectionRepository} from '../../projections/kids-by-location-projection-repository';

@EventsHandler(KidCheckedInEvent, KidCheckedOutEvent)
export class KidsByLocationProjectionEventHandler
  implements IEventHandler<KidCheckedInEvent | KidCheckedOutEvent> {
  constructor(
    @Inject(di_keys.KidsByLocationProj)
    private readonly kidsByLocationRepo: KidsByLocationProjectionRepository,
  ) {}

  async handle(event: KidCheckedInEvent | KidCheckedOutEvent) {
    if (event instanceof KidCheckedInEvent) {
      return await this.kidsByLocationRepo.moveKidToLocation(event.kidId, event.locationId);
    }

    if (event instanceof KidCheckedOutEvent) {
      return await this.kidsByLocationRepo.removeKidFromLocation(event.kidId);
    }
  }
}
