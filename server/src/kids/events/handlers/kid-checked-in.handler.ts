import {IEventHandler, EventsHandler, IEvent} from '@nestjs/cqrs';
import {KidCheckedInEvent} from '../impl/kid-checked-in.event';

@EventsHandler(KidCheckedInEvent)
export class KidCheckedInHandler implements IEventHandler<KidCheckedInEvent> {
  constructor() {}
  async handle(event: KidCheckedInEvent) {
    // tslint:disable-next-line:no-console
    console.log(`handling event: ${JSON.stringify(event, null, 2)}`);
  }
}
