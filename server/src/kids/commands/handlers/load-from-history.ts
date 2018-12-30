import {EventPublisher, ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {KidAggreagateRoot} from '../../models/kid.model';
import {LoadFromHistory} from '../impl/load-from-history.command';

@CommandHandler(LoadFromHistory)
export class LoadFromHistoryHandler
  implements ICommandHandler<LoadFromHistory> {
  constructor(private readonly publisher: EventPublisher) {}

  async execute(command: LoadFromHistory, resolve: (value?) => void) {
    console.log(`LoadFromHistory handled: ${JSON.stringify(command, null, 2)}`); // tslint:disable-line
    const {history} = command;
    const kid = this.publisher.mergeObjectContext(new KidAggreagateRoot());

    kid.loadFromHistory(history);
    resolve();
  }
}
