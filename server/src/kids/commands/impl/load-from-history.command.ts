import {ICommand, IEvent} from '@nestjs/cqrs';

export class LoadFromHistory implements ICommand {
  constructor(public readonly history: IEvent[]) {}
}
