import {EventPublisher, ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {KidAggregateRoot} from '../../models/kid.model';
import {LoadFromHistoryCommand} from '../impl/load-from-history.command';
import {Inject} from '@nestjs/common';
import {AppLogger, LoggerFactory} from 'src/common/logger';

@CommandHandler(LoadFromHistoryCommand)
export class LoadFromHistoryHandler
  implements ICommandHandler<LoadFromHistoryCommand> {
  private readonly logger: AppLogger;
  constructor(
    private readonly publisher: EventPublisher,
    @Inject('KidAggregateRoot')
    private readonly kidAggregateRoot: KidAggregateRoot,
  ) {
    this.logger = LoggerFactory('LoadFromHistoryHandler');
  }

  async execute(command: LoadFromHistoryCommand, resolve: (value?) => void) {
    this.logger.debug({command}, 'LoadFromHistory handled');
    const {rawHistory} = command;

    const kid = this.publisher.mergeObjectContext(this.kidAggregateRoot);

    kid.loadFromHistory(rawHistory);
    resolve();
  }
}
