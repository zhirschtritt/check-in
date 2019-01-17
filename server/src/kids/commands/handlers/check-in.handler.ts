import {EventPublisher, ICommandHandler, CommandHandler} from '@nestjs/cqrs';
import {CheckInCommand} from '../impl/check-in.command';
import {KidAggregateRoot} from '../../models/kid.model';
import {AppLogger, LogFactory} from 'src/common/logger';
import {Inject} from '@nestjs/common';

@CommandHandler(CheckInCommand)
export class CheckInHandler implements ICommandHandler<CheckInCommand> {
  private readonly logger: AppLogger;
  constructor(
    @Inject('LogFactory') logFactory: LogFactory,
    private readonly publisher: EventPublisher,
    @Inject('AggregateRoot')
    private readonly kidAggregateRoot: KidAggregateRoot,
  ) {
    this.logger = logFactory('CheckInHandler');
  }

  async execute(command: CheckInCommand, resolve: (value?) => void) {
    this.logger.debug({command}, 'Handling check-in command');

    const {kidId, locationId} = command;
    const kid = this.publisher.mergeObjectContext(this.kidAggregateRoot);

    try {
      const event = await kid.checkIn(kidId, locationId);
      resolve({event});
    } catch (err) {
      this.logger.error({error: err.message}, 'Error creating event');
      resolve({error: err.message});
    }
  }
}
