import {EventPublisher, ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {KidAggregateRoot} from '../../models/kid.model';
import {LoadFromHistoryCommand} from '../impl/load-from-history.command';
import {AppLogger, LogFactory} from 'src/common/logger';
import {Inject} from '@nestjs/common';
import {di_keys} from '../../../common/di-keys';

@CommandHandler(LoadFromHistoryCommand)
export class LoadFromHistoryHandler
  implements ICommandHandler<LoadFromHistoryCommand> {
  private readonly logger: AppLogger;
  constructor(
    @Inject(di_keys.LogFactory) logFactory: LogFactory,
    private readonly publisher: EventPublisher,
    @Inject(di_keys.AggregateRoot)
    private readonly kidAggregateRoot: KidAggregateRoot,
  ) {
    this.logger = logFactory('LoadFromHistoryHandler');
  }

  async execute(command: LoadFromHistoryCommand, resolve: (value?) => void) {
    this.logger.debug({command}, 'LoadFromHistory handled');
    const {rawHistory} = command;

    const kid = this.publisher.mergeObjectContext(this.kidAggregateRoot);

    kid.loadFromHistory(rawHistory);
    resolve();
  }
}
