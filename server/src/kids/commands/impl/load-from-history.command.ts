import {ICommand} from '@nestjs/cqrs';
import {KidEvent} from '../../events/kid-event.entity';

export class LoadFromHistoryCommand implements ICommand {
  constructor(public readonly rawHistory: KidEvent[]) {}
}
