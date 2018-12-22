import * as clc from 'cli-color';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { KidCheckedInEvent } from '../impl/kid-checked-in.event';

@EventsHandler(KidCheckedInEvent)
export class KidCheckedInHandler implements IEventHandler<KidCheckedInEvent> {
  handle(event: KidCheckedInEvent) {
    console.log(clc.greenBright('KidCheckedInEvent handled...')); // tslint:disable-line
  }
}