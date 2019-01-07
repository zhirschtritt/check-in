import {ICommand} from '@nestjs/cqrs';
import {KidEvent} from 'src/kids/events/kid-event.entity';

export class LoadFromHistory implements ICommand {
  public readonly rawHistory: KidEvent[];
  constructor(data: {rawHistory: KidEvent[]}) {
    this.rawHistory = data.rawHistory;
  }
}
