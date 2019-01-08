import {EventPublisher, ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {KidAggregateRoot} from '../../models/kid.model';
import {LoadFromHistory} from '../impl/load-from-history.command';
import {Inject} from '@nestjs/common';

@CommandHandler(LoadFromHistory)
export class LoadFromHistoryHandler
  implements ICommandHandler<LoadFromHistory> {
  constructor(
    private readonly publisher: EventPublisher,
    @Inject('KidAggregateRoot')
    private readonly kidAggregateRoot: KidAggregateRoot,
  ) {}

  async execute(command: LoadFromHistory, resolve: (value?) => void) {
    console.log(`LoadFromHistory handled: ${JSON.stringify(command, null, 2)}`); // tslint:disable-line
    const {rawHistory} = command;

    const kid = this.publisher.mergeObjectContext(this.kidAggregateRoot);

    kid.loadFromHistory(rawHistory);
    resolve();
  }
}
