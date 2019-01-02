import {ICommand} from '@nestjs/cqrs';
import {KidEvent} from 'src/kids/events/event.entity';

export class LoadFromHistory implements ICommand {
  constructor(public readonly rawHistory: KidEvent[]) {}
}
