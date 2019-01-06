import {IEventHandler, EventsHandler, IEvent} from '@nestjs/cqrs';
import {KidCheckedInEvent} from '../impl/kid-checked-in.event';
import Loki from '@lokidb/loki';
import {Inject} from '@nestjs/common';

@EventsHandler(KidCheckedInEvent)
export class KidCheckedInHandler implements IEventHandler<KidCheckedInEvent> {
  constructor(@Inject('LokiDB') private readonly lokiDB: Loki) {}
  async handle(event: KidCheckedInEvent) {
    // tslint:disable-next-line:no-console
    console.log(`Handling event check-in: ${JSON.stringify(event, null, 2)}`);

    // TODO: inject specific collection as aggregate at boot
    const kidLocations = this.lokiDB.getCollection('kidLocations');
    const newKidLocation = {
      kidId: event.kidId,
      location: event.locationId,
    };

    kidLocations.insert(newKidLocation); // TODO: upsert

    // tslint:disable-next-line:no-console
    console.log(
      'Updating kidLocation aggregate: ',
      JSON.stringify(kidLocations.toJSON(), null, 2),
    );
  }
}
